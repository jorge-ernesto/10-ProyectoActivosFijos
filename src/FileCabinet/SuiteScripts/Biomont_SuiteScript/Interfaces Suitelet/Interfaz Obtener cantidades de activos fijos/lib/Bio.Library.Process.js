/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, record } = N;

        function getProcess(dataActivosFijos, dataFacturasCompras) {

            // Recorrer Activos Fijos
            dataActivosFijos.forEach((value_act, key_act) => {

                dataActivosFijos[key_act]['es_actualizar_cantidad'] = false;

                // Solo se procesarán Activos Fijos con el estado "Nuevo"
                if (value_act.estado.id == 6 || value_act.estado.nombre == 'Nuevo') {

                    // Solo se procesarán Activos Fijos que tengan relacionada una Factura de Compra
                    if (value_act.factura_compra.id) {

                        // Solo se procesarán Activos Fijos que no han sido procesados
                        if (value_act.proceso_actualizar == false) {

                            // Recorrer Facturas de Compras
                            dataFacturasCompras.forEach((value_fac, key_fac) => {

                                // La relación de Activo Fijo y Factura de Compra se realiza por el Centro de Costo (por lo que es necesario que esté registrado)
                                if (value_act.factura_compra.id == value_fac.factura_compra.id) {

                                    // La relación de Activo Fijo y Factura de Compra se realiza por el Centro de Costo (por lo que es necesario que esté registrado)
                                    if (value_act.centro_costo.id == value_fac.centro_costo.id) {

                                        // Solo se actualizará la cantidad de Activos Fijos si la cantidad encontrada en la Factura de Compra es menor a 1
                                        if (Number(value_fac.cantidad) < 1) {

                                            dataActivosFijos[key_act]['es_actualizar_cantidad'] = true;
                                            dataActivosFijos[key_act]['cantidad'] = value_fac.cantidad;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });

            return dataActivosFijos;
        }

        function setUpdate(dataActivosFijosPorActualizar) {

            // Recorremos Activos Fijos
            dataActivosFijosPorActualizar.forEach((value_act, key_act) => {

                // Solo actualizamos activos fijos que tienen el flag para actualizar y cantidades
                if (value_act.es_actualizar_cantidad == true && value_act.cantidad) {

                    // Actualizar Activos Fijos
                    let activoFijoRecord = record.load({ type: 'customrecord_ncfar_asset', id: value_act.activo_fijo.id });
                    activoFijoRecord.setValue('custrecord_bio_can_fac_obt_can_act_fij', value_act.cantidad);
                    activoFijoRecord.setValue('custrecord_bio_proc_obt_can_act_fij', true);
                    activoFijoRecord.save();

                    log.debug('customerRecord', activoFijoRecord);
                }
            });
        }

        return { getProcess, setUpdate }

    });
