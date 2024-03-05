// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Control Fixed Assets Detail (customscript_bio_sl_con_fixed_assets_det)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Helper', './lib/Bio.Library.Search', 'N'],

    function (objHelper, objSearch, N) {

        const { log, record, redirect, runtime, url } = N;
        const { serverWidget } = N.ui;

        const DATA = {
            'clientScriptModulePath': './Bio.Client.ControlActivosFijos.js'
        }

        /******************/

        // Crear formulario
        function createForm(dataActivoFijo) {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administración y control de activo`,
                // title: `Administración y control de activo: ${dataActivoFijo[0].activo_fijo.id} ${dataActivoFijo[0].activo_fijo.nombre}`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath;

            // Mostrar botones
            form.addSubmitButton({
                label: 'Guardar'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab',
                label: 'Detalle de activo'
            });

            /****************** Mostrar Grupo de Campos ******************/
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Datos',
                tab: 'custpage_subtab'
            });

            // Activo Fijo ID interno
            let fieldActivoFijoIdInterno = form.addField({
                id: 'custpage_field_activo_fijo_id_interno',
                label: 'Activo Fijo ID interno',
                type: 'text',
                container: 'custpage_group'
            });
            fieldActivoFijoIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

            // Activo Fijo
            let fieldActivoFijo = form.addField({
                id: 'custpage_field_activo_fijo',
                label: 'Activo Fijo',
                type: 'text',
                container: 'custpage_group'
            });
            fieldActivoFijo.updateBreakType({ breakType: 'STARTCOL' })
            fieldActivoFijo.updateDisplayType({ displayType: 'INLINE' });

            // Transacción
            let fieldTransaccion = form.addField({
                id: 'custpage_field_transaccion',
                label: 'Transacción',
                type: 'text',
                container: 'custpage_group'
            });
            fieldTransaccion.updateBreakType({ breakType: 'STARTROW' })
            fieldTransaccion.updateDisplayType({ displayType: 'INLINE' });

            // Orden de Compra
            let fieldOrdenCompra = form.addField({
                id: 'custpage_field_orden_compra',
                label: 'Orden de Compra',
                type: 'select',
                source: 'purchaseorder',
                container: 'custpage_group'
            });
            fieldOrdenCompra.updateBreakType({ breakType: 'STARTROW' })
            fieldOrdenCompra.updateDisplayType({ displayType: 'INLINE' });

            // Tipo de activo
            let fieldTipoActivo = form.addField({
                id: 'custpage_field_tipo_activo',
                label: 'Tipo de activo',
                type: 'text',
                container: 'custpage_group'
            });
            fieldTipoActivo.updateBreakType({ breakType: 'STARTROW' })
            fieldTipoActivo.updateDisplayType({ displayType: 'INLINE' });

            // Descripción
            let fieldDescripcion = form.addField({
                id: 'custpage_field_descripcion',
                label: 'Descripción',
                type: 'textarea',
                container: 'custpage_group'
            });
            fieldDescripcion.updateBreakType({ breakType: 'STARTCOL' })
            fieldDescripcion.updateDisplayType({ displayType: 'INLINE' });

            // Proveedor
            let fieldProveedor = form.addField({
                id: 'custpage_field_proveedor',
                label: 'Proveedor',
                type: 'text',
                container: 'custpage_group'
            });
            fieldProveedor.updateBreakType({ breakType: 'STARTROW' })
            fieldProveedor.updateDisplayType({ displayType: 'INLINE' });

            // Fecha de compra
            let fieldFechaCompra = form.addField({
                id: 'custpage_field_fecha_compra',
                label: 'Fecha de compra',
                type: 'date',
                container: 'custpage_group'
            });
            fieldFechaCompra.updateBreakType({ breakType: 'STARTROW' })
            fieldFechaCompra.updateDisplayType({ displayType: 'INLINE' });

            // Costo original
            let fieldCostoOriginal = form.addField({
                id: 'custpage_field_costo_original',
                label: 'Costo original',
                type: 'currency',
                container: 'custpage_group'
            });
            fieldCostoOriginal.updateBreakType({ breakType: 'STARTCOL' })
            fieldCostoOriginal.updateDisplayType({ displayType: 'INLINE' });

            // Clase
            let fieldClase = form.addField({
                id: 'custpage_field_clase',
                label: 'Clase',
                type: 'text',
                container: 'custpage_group'
            });
            fieldClase.updateBreakType({ breakType: 'STARTROW' })
            fieldClase.updateDisplayType({ displayType: 'INLINE' });

            // Número de activo alternativo
            let fieldNumeroActivoAlternativo = form.addField({
                id: 'custpage_field_numero_activo_alternativo',
                label: 'Número de activo alternativo',
                type: 'text',
                container: 'custpage_group'
            });
            fieldNumeroActivoAlternativo.updateBreakType({ breakType: 'STARTROW' })
            fieldNumeroActivoAlternativo.updateDisplayType({ displayType: 'INLINE' });

            // Cantidad Factura
            let fieldCantidadFactura = form.addField({
                id: 'custpage_field_cantidad_factura',
                label: 'Cantidad Factura',
                type: 'text',
                container: 'custpage_group'
            });
            fieldCantidadFactura.updateBreakType({ breakType: 'STARTCOL' })
            fieldCantidadFactura.updateDisplayType({ displayType: 'INLINE' });

            // Usuario
            let fieldUsuarioDepositario = form.addField({
                id: 'custpage_field_usuario_depositario',
                label: 'Usuario',
                type: 'text',
                container: 'custpage_group'
            });
            fieldUsuarioDepositario.updateBreakType({ breakType: 'STARTROW' })
            fieldUsuarioDepositario.updateDisplayType({ displayType: 'INLINE' });

            /****************** Mostrar Grupo de Campos ******************/
            form.addFieldGroup({
                id: 'custpage_group_update',
                label: 'Datos a actualizar',
                tab: 'custpage_subtab'
            });

            // Número de guía
            let fieldNumeroGuia = form.addField({
                id: 'custpage_field_numero_guia',
                label: 'Número de guía',
                type: 'text',
                container: 'custpage_group_update'
            });
            fieldNumeroGuia.updateBreakType({ breakType: 'STARTCOL' })

            // Fecha de emisión
            let fieldFechaEmision = form.addField({
                id: 'custpage_field_fecha_emision',
                label: 'Fecha de emisión',
                type: 'date',
                container: 'custpage_group_update'
            });
            fieldFechaEmision.updateBreakType({ breakType: 'STARTROW' })

            // Marca
            let fieldMarca = form.addField({
                id: 'custpage_field_marca',
                label: 'Marca',
                type: 'text',
                container: 'custpage_group_update'
            });
            fieldMarca.updateBreakType({ breakType: 'STARTCOL' })

            // Modelo
            let fieldModelo = form.addField({
                id: 'custpage_field_modelo',
                label: 'Modelo',
                type: 'text',
                container: 'custpage_group_update'
            });
            fieldModelo.updateBreakType({ breakType: 'STARTROW' })

            // N. Serie
            let fieldSerie = form.addField({
                id: 'custpage_field_nserie',
                label: 'N. Serie',
                type: 'text',
                container: 'custpage_group_update'
            });
            fieldSerie.updateBreakType({ breakType: 'STARTROW' })

            // Estado
            let fieldEstado = form.addField({
                id: 'custpage_field_estado',
                label: 'Estado',
                type: 'text',
                container: 'custpage_group_update'
            });
            fieldEstado.updateBreakType({ breakType: 'STARTROW' })

            // Detalle de uso
            let fieldDetalleUso = form.addField({
                id: 'custpage_field_detalle_uso',
                label: 'Detalle de uso',
                type: 'textarea',
                container: 'custpage_group_update'
            });
            fieldDetalleUso.updateBreakType({ breakType: 'STARTCOL' })

            // Usuario Final
            let fieldUsuarioFinal = form.addField({
                id: 'custpage_field_usuario_final',
                label: 'Usuario Final',
                type: 'select',
                source: 'employee',
                container: 'custpage_group_update'
            });
            fieldUsuarioFinal.updateBreakType({ breakType: 'STARTROW' })

            // Fecha de activacion
            let fieldFechaActivacion = form.addField({
                id: 'custpage_field_fecha_activacion',
                label: 'Fecha de activación',
                type: 'date',
                container: 'custpage_group_update'
            });
            fieldFechaActivacion.updateBreakType({ breakType: 'STARTCOL' })

            // Otros
            let fieldOtros = form.addField({
                id: 'custpage_field_otros',
                label: 'Otros',
                type: 'textarea',
                container: 'custpage_group_update'
            });
            fieldOtros.updateBreakType({ breakType: 'STARTROW' })

            return {
                form,
                // Grupo de Campos - Datos
                fieldActivoFijoIdInterno,
                fieldActivoFijo,
                fieldTransaccion,
                fieldOrdenCompra,
                fieldTipoActivo,
                fieldDescripcion,
                fieldProveedor,
                fieldFechaCompra,
                fieldCostoOriginal,
                fieldClase,
                fieldNumeroActivoAlternativo,
                fieldCantidadFactura,
                fieldUsuarioDepositario,
                // Grupo de Campos - Datos a actualizar
                fieldNumeroGuia,
                fieldFechaEmision,
                fieldMarca,
                fieldModelo,
                fieldSerie,
                fieldEstado,
                fieldDetalleUso,
                fieldUsuarioFinal,
                fieldFechaActivacion,
                fieldOtros
            }
        }

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
                    // Grupo de Campos - Datos
                    fieldActivoFijoIdInterno,
                    fieldActivoFijo,
                    fieldTransaccion,
                    fieldOrdenCompra,
                    fieldTipoActivo,
                    fieldDescripcion,
                    fieldProveedor,
                    fieldFechaCompra,
                    fieldCostoOriginal,
                    fieldClase,
                    fieldNumeroActivoAlternativo,
                    fieldCantidadFactura,
                    fieldUsuarioDepositario,
                    // Grupo de Campos - Datos a actualizar
                    fieldNumeroGuia,
                    fieldFechaEmision,
                    fieldMarca,
                    fieldModelo,
                    fieldSerie,
                    fieldEstado,
                    fieldDetalleUso,
                    fieldUsuarioFinal,
                    fieldFechaActivacion,
                    fieldOtros
                } = createForm(dataActivoFijo);

                // Deshabilitar los campos cuando este en estado "Procesado"
                if (dataActivoFijo[0].estado_proceso.id == 2) {
                    fieldNumeroGuia.updateDisplayType({ displayType: 'INLINE' });
                    fieldFechaEmision.updateDisplayType({ displayType: 'INLINE' });
                    fieldMarca.updateDisplayType({ displayType: 'INLINE' });
                    fieldModelo.updateDisplayType({ displayType: 'INLINE' });
                    fieldSerie.updateDisplayType({ displayType: 'INLINE' });
                    fieldEstado.updateDisplayType({ displayType: 'INLINE' });
                    fieldDetalleUso.updateDisplayType({ displayType: 'INLINE' });
                    fieldUsuarioFinal.updateDisplayType({ displayType: 'INLINE' });
                    fieldFechaActivacion.updateDisplayType({ displayType: 'INLINE' });
                    fieldOtros.updateDisplayType({ displayType: 'INLINE' });
                }

                // Setear datos al formulario
                // Datos
                fieldActivoFijoIdInterno.defaultValue = dataActivoFijo[0].activo_fijo.id_interno;
                fieldActivoFijo.defaultValue = dataActivoFijo[0].activo_fijo.id + ' ' + dataActivoFijo[0].activo_fijo.nombre
                fieldTransaccion.defaultValue = dataActivoFijo[0].factura_compra.numero_documento;
                fieldOrdenCompra.defaultValue = dataActivoFijo[0].orden_compra.id;
                fieldTipoActivo.defaultValue = dataActivoFijo[0].tipo_activo.nombre;
                fieldDescripcion.defaultValue = dataActivoFijo[0].descripcion_activo;
                fieldProveedor.defaultValue = dataActivoFijo[0].proveedor;
                fieldFechaCompra.defaultValue = dataActivoFijo[0].fecha_compra;
                fieldCostoOriginal.defaultValue = dataActivoFijo[0].costo_original;
                fieldClase.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldNumeroActivoAlternativo.defaultValue = dataActivoFijo[0].numero_activo_alternativo;
                fieldCantidadFactura.defaultValue = dataActivoFijo[0].cantidad_factura;
                fieldUsuarioDepositario.defaultValue = dataActivoFijo[0].usuario_depositario.nombre;
                // Datos a actualizar
                fieldNumeroGuia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_num_guia_con_act_fij');
                fieldFechaEmision.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fec_emi_con_act_fij');
                fieldMarca.defaultValue = dataActivoFijo_.getValue('custrecord_bio_marca_con_act_fij');
                fieldModelo.defaultValue = dataActivoFijo_.getValue('custrecord_bio_modelo_con_act_fij');
                fieldSerie.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nserie_con_act_fij');
                fieldEstado.defaultValue = dataActivoFijo_.getValue('custrecord_bio_estado_con_act_fij');
                fieldDetalleUso.defaultValue = dataActivoFijo_.getValue('custrecord_bio_det_uso_con_act_fij');
                fieldUsuarioFinal.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usu_fin_con_act_fij');
                fieldFechaActivacion.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fec_act_con_act_fij');
                fieldOtros.defaultValue = dataActivoFijo_.getValue('custrecord_bio_otros_con_act_fij');

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST
                // Recibir parametros por POST
                let activo_fijo_id_interno = scriptContext.request.parameters['custpage_field_activo_fijo_id_interno'];
                let numero_guia = scriptContext.request.parameters['custpage_field_numero_guia'];
                let fecha_emision = scriptContext.request.parameters['custpage_field_fecha_emision'];
                let marca = scriptContext.request.parameters['custpage_field_marca'];
                let modelo = scriptContext.request.parameters['custpage_field_modelo'];
                let nserie = scriptContext.request.parameters['custpage_field_nserie'];
                let estado = scriptContext.request.parameters['custpage_field_estado'];
                let detalle_uso = scriptContext.request.parameters['custpage_field_detalle_uso'];
                let usuario_final = scriptContext.request.parameters['custpage_field_usuario_final'];
                let fecha_activacion = scriptContext.request.parameters['custpage_field_fecha_activacion'];
                let otros = scriptContext.request.parameters['custpage_field_otros'];

                // Actualizar Activos Fijos
                let activoFijoRecord = record.load({ type: 'customrecord_ncfar_asset', id: activo_fijo_id_interno });
                activoFijoRecord.setValue('custrecord_bio_num_guia_con_act_fij', numero_guia);
                activoFijoRecord.setText('custrecord_bio_fec_emi_con_act_fij', fecha_emision);
                activoFijoRecord.setValue('custrecord_bio_marca_con_act_fij', marca);
                activoFijoRecord.setValue('custrecord_bio_modelo_con_act_fij', modelo);
                activoFijoRecord.setValue('custrecord_bio_nserie_con_act_fij', nserie);
                activoFijoRecord.setValue('custrecord_bio_estado_con_act_fij', estado);
                activoFijoRecord.setValue('custrecord_bio_det_uso_con_act_fij', detalle_uso);
                activoFijoRecord.setValue('custrecord_bio_usu_fin_con_act_fij', usuario_final);
                activoFijoRecord.setText('custrecord_bio_fec_act_con_act_fij', fecha_activacion);
                activoFijoRecord.setValue('custrecord_bio_otros_con_act_fij', otros);
                activoFijoRecord.setValue('custrecord_bio_est_proc_con_act_fij', 2);
                activoFijoRecord.save();

                // Redirigir a este mismo Suitelet (Redirigir a si mismo)
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
