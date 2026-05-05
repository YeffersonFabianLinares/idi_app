interface IDetalle {
    ordinal: string
    cons: string
    nom_examen: string
    has_result: boolean
}

interface IMaestro {
    ordinal: string
    num_ref: string
    fec_factura: string
    detalles: IDetalle[]
}

export interface IResult {
    data: IMaestro[]
    paciente: {
        num_doc: string
        pri_nombre: string
        pri_apellido: string
        fec_nacido: string
        edad?: number
    }
}