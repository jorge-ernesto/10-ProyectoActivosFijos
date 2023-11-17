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

            /****************** Mostrar Grupo de Campos - Activo fijo ******************/
            form.addFieldGroup({
                id: 'custpage_group_actfij',
                label: 'Activo fijo',
                tab: 'custpage_subtab'
            });

            // Activo Fijo ID interno
            let fieldActivoFijoIdInterno = form.addField({
                id: 'custpage_field_activo_fijo_id_interno',
                label: 'Activo Fijo ID interno',
                type: 'text',
                container: 'custpage_group_datpro'
            });
            fieldActivoFijoIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

            // Estado Accion
            let fieldEstadoAccion = form.addField({
                id: 'custpage_field_estado_accion',
                label: 'Estado accion',
                type: 'select',
                // source: 'customlist_bio_lis_est_acc_con_act',
                container: 'custpage_group_actfij'
            });
            fieldEstadoAccion.updateBreakType({ breakType: 'STARTCOL' })
            setFieldEstadoAccion(fieldEstadoAccion);

            /****************** Mostrar Grupo de Campos - Datos del proveedor ******************/
            form.addFieldGroup({
                id: 'custpage_group_datpro',
                label: 'Datos del proveedor',
                tab: 'custpage_subtab'
            });

            // Proveedor
            let fieldProveedor = form.addField({
                id: 'custpage_field_proveedor',
                label: 'Proveedor',
                type: 'text',
                container: 'custpage_group_datpro'
            });
            fieldProveedor.updateBreakType({ breakType: 'STARTCOL' })
            fieldProveedor.updateDisplayType({ displayType: 'INLINE' });

            // Orden de Compra
            let fieldOrdenCompra = form.addField({
                id: 'custpage_field_orden_compra',
                label: 'Orden de Compra',
                type: 'select',
                source: 'purchaseorder',
                container: 'custpage_group_datpro'
            });
            fieldOrdenCompra.updateBreakType({ breakType: 'STARTROW' })
            fieldOrdenCompra.updateDisplayType({ displayType: 'INLINE' });

            // Fecha de compra
            let fieldFechaCompra = form.addField({
                id: 'custpage_field_fecha_compra',
                label: 'Fecha de compra',
                type: 'date',
                container: 'custpage_group_datpro'
            });
            fieldFechaCompra.updateBreakType({ breakType: 'STARTCOL' })
            fieldFechaCompra.updateDisplayType({ displayType: 'INLINE' });

            // Transacción
            let fieldTransaccion = form.addField({
                id: 'custpage_field_transaccion',
                label: 'Transacción',
                type: 'text',
                container: 'custpage_group_datpro'
            });
            fieldTransaccion.updateBreakType({ breakType: 'STARTROW' })
            fieldTransaccion.updateDisplayType({ displayType: 'INLINE' });

            // Costo original
            let fieldCostoOriginal = form.addField({
                id: 'custpage_field_costo_original',
                label: 'Costo original',
                type: 'currency',
                container: 'custpage_group_datpro'
            });
            fieldCostoOriginal.updateBreakType({ breakType: 'STARTROW' })
            fieldCostoOriginal.updateDisplayType({ displayType: 'INLINE' });

            // Número de guía
            let fieldNumeroGuia = form.addField({
                id: 'custpage_field_numero_guia',
                label: 'Número de guía',
                type: 'text',
                container: 'custpage_group_datpro'
            });
            fieldNumeroGuia.updateBreakType({ breakType: 'STARTCOL' })

            /****************** Mostrar Grupo de Campos - Datos del bien ******************/
            form.addFieldGroup({
                id: 'custpage_group_datbie',
                label: 'Datos del bien',
                tab: 'custpage_subtab'
            });
            // Tipo de activo
            let fieldTipoActivo = form.addField({
                id: 'custpage_field_tipo_activo',
                label: 'Tipo de activo',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldTipoActivo.updateBreakType({ breakType: 'STARTCOL' })
            fieldTipoActivo.updateDisplayType({ displayType: 'INLINE' });

            // Activo Fijo
            let fieldActivoFijo = form.addField({
                id: 'custpage_field_activo_fijo',
                label: 'Activo Fijo',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldActivoFijo.updateBreakType({ breakType: 'STARTROW' })
            fieldActivoFijo.updateDisplayType({ displayType: 'INLINE' });

            // Descripción
            let fieldDescripcion = form.addField({
                id: 'custpage_field_descripcion',
                label: 'Descripción',
                type: 'textarea',
                container: 'custpage_group_datbie'
            });
            fieldDescripcion.updateBreakType({ breakType: 'STARTROW' })
            fieldDescripcion.updateDisplayType({ displayType: 'INLINE' });

            // Centro de Costo (Clase)
            let fieldClase = form.addField({
                id: 'custpage_field_clase',
                label: 'Centro de Costo (Clase)',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldClase.updateBreakType({ breakType: 'STARTCOL' })
            fieldClase.updateDisplayType({ displayType: 'INLINE' });

            // Marca
            let fieldMarca = form.addField({
                id: 'custpage_field_marca',
                label: 'Marca',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldMarca.updateBreakType({ breakType: 'STARTROW' })

            // Modelo
            let fieldModelo = form.addField({
                id: 'custpage_field_modelo',
                label: 'Modelo',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldModelo.updateBreakType({ breakType: 'STARTROW' })

            // Fecha de emisión
            let fieldFechaEmision = form.addField({
                id: 'custpage_field_fecha_emision',
                label: 'Fecha de emisión',
                type: 'date',
                container: 'custpage_group_datbie'
            });
            fieldFechaEmision.updateBreakType({ breakType: 'STARTCOL' })

            // Fecha de activacion
            let fieldFechaActivacion = form.addField({
                id: 'custpage_field_fecha_activacion',
                label: 'Fecha de activación',
                type: 'date',
                container: 'custpage_group_datbie'
            });
            fieldFechaActivacion.updateBreakType({ breakType: 'STARTROW' })

            // Detalle de uso
            let fieldDetalleUso = form.addField({
                id: 'custpage_field_detalle_uso',
                label: 'Detalle de uso',
                type: 'textarea',
                container: 'custpage_group_datbie'
            });
            fieldDetalleUso.updateBreakType({ breakType: 'STARTROW' })

            // N. Serie
            let fieldSerie = form.addField({
                id: 'custpage_field_nserie',
                label: 'N. Serie',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldSerie.updateBreakType({ breakType: 'STARTROW' })

            // Usuario (Depositario)
            let fieldUsuarioDepositario = form.addField({
                id: 'custpage_field_usuario_depositario',
                label: 'Usuario (Depositario)',
                type: 'select',
                source: 'employee',
                container: 'custpage_group_datbie'
            });
            fieldUsuarioDepositario.updateBreakType({ breakType: 'STARTROW' })

            // Número de activo alternativo
            let fieldNumeroActivoAlternativo = form.addField({
                id: 'custpage_field_numero_activo_alternativo',
                label: 'Número de activo alternativo',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldNumeroActivoAlternativo.updateBreakType({ breakType: 'STARTCOL' })
            fieldNumeroActivoAlternativo.updateDisplayType({ displayType: 'INLINE' });

            // Cantidad Factura
            let fieldCantidadFactura = form.addField({
                id: 'custpage_field_cantidad_factura',
                label: 'Cantidad Factura',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldCantidadFactura.updateBreakType({ breakType: 'STARTROW' })
            fieldCantidadFactura.updateDisplayType({ displayType: 'INLINE' });

            // Estado
            let fieldEstado = form.addField({
                id: 'custpage_field_estado',
                label: 'Estado',
                type: 'text',
                container: 'custpage_group_datbie'
            });
            fieldEstado.updateBreakType({ breakType: 'STARTROW' })

            // Otros
            let fieldOtros = form.addField({
                id: 'custpage_field_otros',
                label: 'Otros',
                type: 'textarea',
                container: 'custpage_group_datbie'
            });
            fieldOtros.updateBreakType({ breakType: 'STARTROW' })

            return {
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
                fieldNumeroGuia,
                // Datos del bien
                fieldTipoActivo,
                fieldActivoFijo,
                fieldDescripcion,
                fieldClase,
                fieldMarca,
                fieldModelo,
                fieldFechaEmision,
                fieldFechaActivacion,
                fieldDetalleUso,
                fieldSerie,
                fieldUsuarioDepositario,
                fieldNumeroActivoAlternativo,
                fieldCantidadFactura,
                fieldEstado,
                fieldOtros
            }
        }

        function setFieldEstadoAccion(fieldEstadoAccion) {
            // Obtener datos por search
            let estadoAccionList = objSearch.getEstadoAccionList();

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            estadoAccionList.forEach((element, i) => {
                fieldEstadoAccion.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
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
                    // Activo fijo
                    fieldActivoFijoIdInterno,
                    fieldEstadoAccion, // Editable
                    // Datos del proveedor
                    fieldProveedor,
                    fieldOrdenCompra,
                    fieldFechaCompra,
                    fieldTransaccion,
                    fieldCostoOriginal,
                    fieldNumeroGuia, // Editable
                    // Datos del bien
                    fieldTipoActivo,
                    fieldActivoFijo,
                    fieldDescripcion,
                    fieldClase,
                    fieldMarca, // Editable
                    fieldModelo, // Editable
                    fieldFechaEmision, // Editable
                    fieldFechaActivacion, // Editable
                    fieldDetalleUso, // Editable
                    fieldSerie, // Editable
                    fieldUsuarioDepositario, // Editable
                    fieldNumeroActivoAlternativo,
                    fieldCantidadFactura,
                    fieldEstado, // Editable
                    fieldOtros // Editable
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
                    fieldUsuarioDepositario.updateDisplayType({ displayType: 'INLINE' });
                    fieldFechaActivacion.updateDisplayType({ displayType: 'INLINE' });
                    fieldOtros.updateDisplayType({ displayType: 'INLINE' });
                }

                // Setear datos al formulario
                // Activo fijo
                fieldActivoFijoIdInterno.defaultValue = dataActivoFijo[0].activo_fijo.id_interno;
                fieldEstadoAccion.defaultValue = dataActivoFijo[0].estado_accion.id; // Editable
                // Datos del proveedor
                fieldProveedor.defaultValue = dataActivoFijo[0].proveedor;
                fieldOrdenCompra.defaultValue = dataActivoFijo[0].orden_compra.id;
                fieldFechaCompra.defaultValue = dataActivoFijo[0].fecha_compra;
                fieldTransaccion.defaultValue = dataActivoFijo[0].factura_compra.numero_documento;
                fieldCostoOriginal.defaultValue = dataActivoFijo[0].costo_original;
                fieldNumeroGuia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_num_guia_con_act_fij'); // Editable
                // Datos del bien
                fieldTipoActivo.defaultValue = dataActivoFijo[0].tipo_activo.nombre;
                fieldActivoFijo.defaultValue = dataActivoFijo[0].activo_fijo.id + ' ' + dataActivoFijo[0].activo_fijo.nombre
                fieldDescripcion.defaultValue = dataActivoFijo[0].descripcion_activo;
                fieldClase.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldMarca.defaultValue = dataActivoFijo_.getValue('custrecord_bio_marca_con_act_fij'); // Editable
                fieldModelo.defaultValue = dataActivoFijo_.getValue('custrecord_bio_modelo_con_act_fij'); // Editable
                fieldFechaEmision.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fec_emi_con_act_fij'); // Editable
                fieldFechaActivacion.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fec_act_con_act_fij'); // Editable
                fieldDetalleUso.defaultValue = dataActivoFijo_.getValue('custrecord_bio_det_uso_con_act_fij'); // Editable
                fieldSerie.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nserie_con_act_fij'); // Editable
                fieldUsuarioDepositario.defaultValue = dataActivoFijo[0].usuario_depositario.id; // Editable
                fieldNumeroActivoAlternativo.defaultValue = dataActivoFijo[0].numero_activo_alternativo;
                fieldCantidadFactura.defaultValue = dataActivoFijo[0].cantidad_factura;
                fieldEstado.defaultValue = dataActivoFijo_.getValue('custrecord_bio_estado_con_act_fij'); // Editable
                fieldOtros.defaultValue = dataActivoFijo_.getValue('custrecord_bio_otros_con_act_fij'); // Editable

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST
                // Recibir parametros por POST
                // Activo fijo
                let activo_fijo_id_interno = scriptContext.request.parameters['custpage_field_activo_fijo_id_interno'];
                let estado_accion = scriptContext.request.parameters['custpage_field_estado_accion'];
                // Datos del proveedor
                let numero_guia = scriptContext.request.parameters['custpage_field_numero_guia'];
                // Datos del bien
                let marca = scriptContext.request.parameters['custpage_field_marca'];
                let modelo = scriptContext.request.parameters['custpage_field_modelo'];
                let fecha_emision = scriptContext.request.parameters['custpage_field_fecha_emision'];
                let fecha_activacion = scriptContext.request.parameters['custpage_field_fecha_activacion'];
                let detalle_uso = scriptContext.request.parameters['custpage_field_detalle_uso'];
                let nserie = scriptContext.request.parameters['custpage_field_nserie'];
                let usuario_depositario = scriptContext.request.parameters['custpage_field_usuario_depositario'];
                let estado = scriptContext.request.parameters['custpage_field_estado'];
                let otros = scriptContext.request.parameters['custpage_field_otros'];

                // Actualizar Activos Fijos
                // Activo fijo
                let activoFijoRecord = record.load({ type: 'customrecord_ncfar_asset', id: activo_fijo_id_interno });
                activoFijoRecord.setValue('custrecord_bio_est_acc_con_act_fij', estado_accion);
                // Datos del proveedor
                activoFijoRecord.setValue('custrecord_bio_num_guia_con_act_fij', numero_guia);
                // Datos del bien
                activoFijoRecord.setValue('custrecord_bio_marca_con_act_fij', marca);
                activoFijoRecord.setValue('custrecord_bio_modelo_con_act_fij', modelo);
                activoFijoRecord.setText('custrecord_bio_fec_emi_con_act_fij', fecha_emision);
                activoFijoRecord.setText('custrecord_bio_fec_act_con_act_fij', fecha_activacion);
                activoFijoRecord.setValue('custrecord_bio_det_uso_con_act_fij', detalle_uso);
                activoFijoRecord.setValue('custrecord_bio_nserie_con_act_fij', nserie);
                // activoFijoRecord.setValue('custrecord_assetcaretaker', usuario_depositario); // Actualiza datos del Usuario Depositario
                activoFijoRecord.setValue('custrecord_bio_estado_con_act_fij', estado);
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
