import { NextResponse } from "next/server";
import connectionPool from "../../../../config/db";

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);

  try {
    const Documento = searchParams.get("Documento");
    const Id = searchParams.get("Id");
    const Rol = searchParams.get("Rol");

    if (!Documento || !Id || !Rol) {
      return NextResponse.json(
        { body: "Bad Request" },
        {
          status: 400,
        }
      );
    }

    let InfoDb: {} = {};

    const [getTipo]: any = await connectionPool.query(`
    SELECT tipo FROM usuario WHERE idUsuario = ${Id} and rol='${Rol}'`);

    if (getTipo[0]?.tipo == "ESTUDIANTE") {
      const [GetInfoStudent]: any = await connectionPool.query(`
      select alumno_num_docu as Documento,concat (alumno_nom1,' ',alumno_nom2) as Nombre,concat (alumno_ape1,' ',alumno_ape2) as Apellidos,alumno_email as Correo,alumno_celular as Celular,alumno_genero as Genero,alumno_rum as RUM,alumno_id as Id, usuario.pass as Pass, usuario.login as Usuario, pfc_alumno.tipo_docu_id as TipoDocumento from pfc_alumno LEFT JOIN usuario ON (pfc_alumno.alumno_id=usuario.idUsuario) where pfc_alumno.alumno_num_docu =${Documento} and usuario.rol='${Rol}'`);

      InfoDb = GetInfoStudent[0];
    }
    if (getTipo[0]?.tipo == "ADMINISTRATIVO") {
      const [GetInfoAdmin]: any = await connectionPool.query(`
      select documento as Documento,concat (admco_nom1,' ',admco_nom2) as Nombre,concat (admco_ape1,' ',admco_ape2) as Apellidos,mail as Correo,admco_celular as Celular,genero as Genero,admco.id as Id, usuario.pass as Pass, usuario.login as Usuario, admco.tipo_documento as TipoDocumento from admco LEFT JOIN usuario ON (admco.id=usuario.idUsuario) where  admco.documento ='${Documento}' and usuario.rol='${Rol}'
      `);

      InfoDb = GetInfoAdmin[0];
    }
    if (getTipo[0]?.tipo == "PROFESOR") {
      const [GetInfoDocente]: any = await connectionPool.query(`
      select dcne_num_docu as Documento,concat (dcne_nom1,' ',dcne_nom2) as Nombre,concat (dcne_ape1,' ',dcne_ape2) as Apellidos,dcne_email_perso as Correo,dcne_celular as Celular,dcne_genero as Genero,dcne.i as Id, usuario.pass as Pass, usuario.login as Usuario, dcne.tipo_docu_id as TipoDocumento from dcne LEFT JOIN usuario ON (dcne.i=usuario.idUsuario) where  dcne.dcne_num_docu =${Documento} and usuario.rol='${Rol}'
      `);

      InfoDb = GetInfoDocente[0];
    }

    if (Rol === "4") {
    }
    // const [GetInfo]: any = await connectionPool.query(`
    //   SELECT * FROM Usuario WHERE Documento = ${Documento} AND Id = ${Id}
    //   `);

    return NextResponse.json(
      { InfoDb: InfoDb || {} },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { body: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}
