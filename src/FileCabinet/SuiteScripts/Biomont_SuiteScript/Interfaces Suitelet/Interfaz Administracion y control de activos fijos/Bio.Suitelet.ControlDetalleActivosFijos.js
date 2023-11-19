// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Control Fixed Assets Detail (customscript_bio_sl_con_fixed_assets_det)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Widget', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objWidget, objHelper, N) {

        const { log, record, redirect, runtime } = N;

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {

            if (scriptContext.request.method == 'GET') {

                // Obtener datos por url
                let id = scriptContext.request.parameters['_id'];

                // Obtener datos por search
                let dataActivoFijo = objSearch.getDataActivosFijos([''], [''], '', '', '', '', id);

                // Obtener datos por record
                let dataActivoFijo_ = record.load({ type: 'customrecord_ncfar_asset', id: id });

                // Debug
                // objHelper.error_log('id', id);
                // objHelper.error_log('dataActivosFijo', dataActivoFijo);

                // Crear formulario
                let {
                    form,
                    // Activo fijo
                    fieldActivoFijoIdInterno,
                    fieldEstadoAccion,
                    // Datos del proveedor
                    fieldProveedor,
                    fieldOrdenCompra,
                    fieldFechaCompra,
                    fieldTransaccion,
                    fieldCostoOriginal,
                    fieldNumeroActivoAlternativo,
                    fieldCantidadFactura,
                    fieldNumeroGuia,
                    // Datos del bien
                    fieldTipoActivo,
                    fieldActivoFijo,
                    fieldDescripcion,
                    fieldEstadoActivo,
                    fieldClase,
                    fieldMarca,
                    fieldModelo,
                    fieldFechaActivacion,
                    fieldSerie,
                    fieldUsuarioDepositario,
                    fieldUbicacion,
                    fieldEstadoBien,
                    fieldDetalleUso,
                    // Baja de activo
                    fieldMotivoBaja,
                    fieldDetalleBaja,
                    fieldAnteriorClase_Baja,
                    fieldUsuarioFirma_AnteriorClase_Baja,
                    fieldFechaFirma_AnteriorClase_Baja,
                    botonAnteriorClase_Baja,
                    fieldArchivoBaja,
                    // Transferencia de activo
                    fieldAnteriorClase_Transferencia,
                    fieldUsuarioFirma_AnteriorClase_Transferencia,
                    fieldFechaFirma_AnteriorClase_Transferencia,
                    botonAnteriorClase_Transferencia,
                    fieldNuevaClase_Transferencia,
                    fieldUsuarioFirma_NuevaClase_Transferencia,
                    fieldFechaFirma_NuevaClase_Transferencia,
                    botonNuevaClase_Transferencia,
                    fieldNuevaUbicacion,
                    fieldNuevoUsuarioDepositario
                } = objWidget.createFormDetail(dataActivoFijo);

                /****************** Deshabilitar campos ******************/
                // Deshabilitar los campos cuando este en estado "ALTA", "BAJA" o "TRANSFERENCIA"
                if (Number(dataActivoFijo[0].estado_accion.id || 0) > 0) {
                    // Datos del proveedor
                    fieldNumeroGuia.updateDisplayType({ displayType: 'INLINE' });
                    // Datos del bien
                    fieldMarca.updateDisplayType({ displayType: 'INLINE' });
                    fieldModelo.updateDisplayType({ displayType: 'INLINE' });
                    fieldFechaActivacion.updateDisplayType({ displayType: 'INLINE' });
                    fieldSerie.updateDisplayType({ displayType: 'INLINE' });
                    fieldUsuarioDepositario.updateDisplayType({ displayType: 'INLINE' });
                    fieldUbicacion.updateDisplayType({ displayType: 'INLINE' });
                    fieldEstadoBien.updateDisplayType({ displayType: 'INLINE' });
                    fieldDetalleUso.updateDisplayType({ displayType: 'INLINE' });
                }

                // Deshabilitar campo "Fecha de Activación" cuando el "Estado Activo" es diferente de "Nuevo"
                if (!(dataActivoFijo[0].estado_activo.id == 6 || dataActivoFijo[0].estado_activo.id == 'Nuevo')) {
                    // Datos del bien
                    fieldFechaActivacion.updateDisplayType({ displayType: 'INLINE' });
                }

                /****************** Setear datos al formulario ******************/
                // Activo fijo
                fieldActivoFijoIdInterno.defaultValue = dataActivoFijo[0].activo_fijo.id_interno;
                fieldEstadoAccion.defaultValue = dataActivoFijo[0].estado_accion.id; // Editable

                // Datos del proveedor
                fieldProveedor.defaultValue = dataActivoFijo[0].proveedor;
                fieldOrdenCompra.defaultValue = dataActivoFijo[0].orden_compra.id;
                fieldFechaCompra.defaultValue = dataActivoFijo[0].fecha_compra;
                fieldTransaccion.defaultValue = dataActivoFijo[0].factura_compra.numero_documento;
                fieldCostoOriginal.defaultValue = dataActivoFijo[0].costo_original;
                fieldNumeroActivoAlternativo.defaultValue = dataActivoFijo[0].numero_activo_alternativo;
                fieldCantidadFactura.defaultValue = dataActivoFijo[0].cantidad_factura;
                fieldNumeroGuia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_num_guia_con_act_fij'); // Editable

                // Datos del bien
                fieldTipoActivo.defaultValue = dataActivoFijo[0].tipo_activo.nombre;
                fieldActivoFijo.defaultValue = dataActivoFijo[0].activo_fijo.id + ' ' + dataActivoFijo[0].activo_fijo.nombre
                fieldDescripcion.defaultValue = dataActivoFijo[0].descripcion_activo;
                fieldEstadoActivo.defaultValue = dataActivoFijo[0].estado_activo.nombre;
                fieldClase.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldMarca.defaultValue = dataActivoFijo_.getValue('custrecord_bio_marca_con_act_fij'); // Editable
                fieldModelo.defaultValue = dataActivoFijo_.getValue('custrecord_bio_modelo_con_act_fij'); // Editable
                fieldFechaActivacion.defaultValue = dataActivoFijo_.getValue('custrecord_assetdeprstartdate'); // Editable // INFORMACION CAMPO EXISTENTE
                fieldSerie.defaultValue = dataActivoFijo_.getValue('custrecord_assetserialno'); // Editable // INFORMACION CAMPO EXISTENTE
                fieldUsuarioDepositario.defaultValue = dataActivoFijo_.getValue('custrecord_assetcaretaker'); // Editable // INFORMACION CAMPO EXISTENTE
                fieldUbicacion.defaultValue = dataActivoFijo_.getValue('custrecord_bio_ubicacion_con_act_fij'); // Editable
                fieldEstadoBien.defaultValue = dataActivoFijo_.getValue('custrecord_bio_estado_con_act_fij'); // Editable
                fieldDetalleUso.defaultValue = dataActivoFijo_.getValue('custrecord_bio_det_uso_con_act_fij'); // Editable

                // Baja de activo
                fieldMotivoBaja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_mot_baja_con_act_fij'); // Editable
                fieldDetalleBaja.defaultValue = dataActivoFijo_.getValue('custrecord_det_baja_con_act_fij'); // Editable
                fieldAnteriorClase_Baja.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldUsuarioFirma_AnteriorClase_Baja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usufir_baja_con_act'); // Editable
                fieldFechaFirma_AnteriorClase_Baja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fecfir_baja_con_act'); // Editable

                // Transferencia de activo
                fieldAnteriorClase_Transferencia.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldUsuarioFirma_AnteriorClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usufirantcc_trans_con_act'); // Editable
                fieldFechaFirma_AnteriorClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fecfirantcc_trans_con_act'); // Editable
                fieldNuevaClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nue_cc_con_act_fij'); // Editable
                fieldUsuarioFirma_NuevaClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usufirnuecc_trans_con_act'); // Editable
                fieldFechaFirma_NuevaClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fecfirnuecc_trans_con_act'); // Editable
                fieldNuevaUbicacion.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nue_ubicacion_con_act_fij'); // Editable
                fieldNuevoUsuarioDepositario.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nue_usu_depo_con_act_fij'); // Editable

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST
                /****************** Recibir parametros por POST ******************/
                // Activo fijo
                let activo_fijo_id_interno = scriptContext.request.parameters['custpage_field_activo_fijo_id_interno'];
                let estado_accion = scriptContext.request.parameters['custpage_field_estado_accion'];

                // Datos del proveedor
                let numero_guia = scriptContext.request.parameters['custpage_field_numero_guia'];

                // Datos del bien
                let marca = scriptContext.request.parameters['custpage_field_marca'];
                let modelo = scriptContext.request.parameters['custpage_field_modelo'];
                let fecha_activacion = scriptContext.request.parameters['custpage_field_fecha_activacion']; // ACTUALIZA CAMPO EXISTENTE
                let nserie = scriptContext.request.parameters['custpage_field_nserie']; // ACTUALIZA CAMPO EXISTENTE
                let usuario_depositario = scriptContext.request.parameters['custpage_field_usuario_depositario']; // ACTUALIZA CAMPO EXISTENTE
                let ubicacion = scriptContext.request.parameters['custpage_field_ubicacion'];
                let estado_bien = scriptContext.request.parameters['custpage_field_estado_bien'];
                let detalle_uso = scriptContext.request.parameters['custpage_field_detalle_uso'];

                // Baja de activo
                let motivo_baja = scriptContext.request.parameters['custpage_field_motivo_baja'];
                let detalle_baja = scriptContext.request.parameters['custpage_field_detalle_baja'];
                let usuariofirma_anteriorclase_baja = scriptContext.request.parameters['custpage_field_usuariofirma_anteriorclase_baja'];
                let fechafirma_anteriorclase_baja = scriptContext.request.parameters['custpage_field_fechafirma_anteriorclase_baja'];

                // Transferencia de activo
                let usuariofirma_anteriorclase_transferencia = scriptContext.request.parameters['custpage_field_usuariofirma_anteriorclase_transferencia'];
                let fechafirma_anteriorclase_transferencia = scriptContext.request.parameters['custpage_field_fechafirma_anteriorclase_transferencia'];
                let nuevaclase_transferencia = scriptContext.request.parameters['custpage_field_nuevaclase_transferencia'];
                let usuariofirma_nuevaclase_transferencia = scriptContext.request.parameters['custpage_field_usuariofirma_nuevaclase_transferencia'];
                let fechafirma_nuevaclase_transferencia = scriptContext.request.parameters['custpage_field_fechafirma_nuevaclase_transferencia'];
                let nueva_ubicacion = scriptContext.request.parameters['custpage_field_nueva_ubicacion'];
                let nuevo_usuario_depositario = scriptContext.request.parameters['custpage_field_nuevo_usuario_depositario'];

                /****************** Actualizar Activos Fijos ******************/
                // Activo fijo
                let activoFijoRecord = record.load({ type: 'customrecord_ncfar_asset', id: activo_fijo_id_interno });
                activoFijoRecord.setValue('custrecord_bio_est_acc_con_act_fij', estado_accion);
                activoFijoRecord.setValue('custrecord_bio_est_proc_con_act_fij', 2);

                // Datos del proveedor
                activoFijoRecord.setValue('custrecord_bio_num_guia_con_act_fij', numero_guia);

                // Datos del bien
                activoFijoRecord.setValue('custrecord_bio_marca_con_act_fij', marca);
                activoFijoRecord.setValue('custrecord_bio_modelo_con_act_fij', modelo);
                if (activoFijoRecord.getValue('custrecord_assetstatus') == 6 || activoFijoRecord.getText('custrecord_assetstatus') == 'Nuevo') { // Solo guardara "Fecha de Activación" cuando el "Estado Activo" es "Nuevo"
                    // activoFijoRecord.setText('custrecord_assetdeprstartdate', fecha_activacion); // ACTUALIZA CAMPO EXISTENTE
                }
                // activoFijoRecord.setValue('custrecord_assetserialno', nserie); // ACTUALIZA CAMPO EXISTENTE
                // activoFijoRecord.setValue('custrecord_assetcaretaker', usuario_depositario); // ACTUALIZA CAMPO EXISTENTE
                activoFijoRecord.setValue('custrecord_bio_ubicacion_con_act_fij', ubicacion);
                activoFijoRecord.setValue('custrecord_bio_est_bien_con_act_fij', estado_bien);
                activoFijoRecord.setValue('custrecord_bio_det_uso_con_act_fij', detalle_uso);

                // Baja de activo
                activoFijoRecord.setValue('custrecord_bio_mot_baja_con_act_fij', motivo_baja);
                activoFijoRecord.setValue('custrecord_det_baja_con_act_fij', detalle_baja);
                activoFijoRecord.setValue('custrecord_bio_usufir_baja_con_act', usuariofirma_anteriorclase_baja);
                activoFijoRecord.setValue('custrecord_bio_fecfir_baja_con_act', fechafirma_anteriorclase_baja);

                // Transferencia de activo
                activoFijoRecord.setValue('custrecord_bio_usufirantcc_trans_con_act', usuariofirma_anteriorclase_transferencia);
                activoFijoRecord.setValue('custrecord_bio_fecfirantcc_trans_con_act', fechafirma_anteriorclase_transferencia);
                activoFijoRecord.setValue('custrecord_bio_nue_cc_con_act_fij', nuevaclase_transferencia);
                activoFijoRecord.setValue('custrecord_bio_usufirnuecc_trans_con_act', usuariofirma_nuevaclase_transferencia);
                activoFijoRecord.setValue('custrecord_bio_fecfirnuecc_trans_con_act', fechafirma_nuevaclase_transferencia);
                activoFijoRecord.setValue('custrecord_bio_nue_ubicacion_con_act_fij', nueva_ubicacion);
                activoFijoRecord.setValue('custrecord_bio_nue_usu_depo_con_act_fij', nuevo_usuario_depositario);

                activoFijoRecord.save();

                /****************** Redirigir a este mismo Suitelet (Redirigir a si mismo) ******************/
                redirect.toSuitelet({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    parameters: {
                        '_id': activo_fijo_id_interno
                    }
                });
            }
        }

        return { onRequest }

    });
