/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Search', './Bio.Library.Helper', 'N'],

    function (objSearch, objHelper, N) {

        const { log } = N;
        const { serverWidget } = N.ui;

        const DATA = {
            'clientScriptModulePath': {
                'suiteletReport': './../Bio.Client.ControlActivosFijos.js',
                'suiteletDetail': './../Bio.Client.ControlActivosFijos.Detalle.js',
            }
        }

        /****************** Suitelet Report ******************/
        function createFormReport() {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administración y control de activos`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath.suiteletReport;

            // Mostrar botones
            form.addSubmitButton({
                label: 'Consultar'
            });
            // form.addButton({
            //     id: 'custpage_button_obtener_activos_fijos',
            //     label: 'Obtener activos',
            //     functionName: 'getFixedAssets()'
            // });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab',
                label: 'Lista de activos'
            });

            /******************  Filtros ******************/
            // Mostrar Grupo de Campos
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Filtros',
                tab: 'custpage_subtab'
            });

            // Tipos de activos
            let fieldAssetType = form.addField({
                id: 'custpage_field_filter_assettype',
                label: 'Tipos de activos',
                type: 'select',
                // source: 'customrecord_ncfar_assettype',
                container: 'custpage_group'
            });
            fieldAssetType.updateBreakType({ breakType: 'STARTCOL' })
            setFieldReport(fieldAssetType, 'fieldAssetType');

            // Subsidiarias
            let fieldSubsidiary = form.addField({
                id: 'custpage_field_filter_subsidiary',
                label: 'Subsidiarias',
                type: 'multiselect',
                source: 'subsidiary',
                container: 'custpage_group'
            });
            fieldSubsidiary.updateBreakType({ breakType: 'STARTCOL' })

            // Clases - Centros de Costos
            let fieldClass = form.addField({
                id: 'custpage_field_filter_class',
                label: 'Centros de Costos',
                type: 'select',
                // source: 'classification',
                container: 'custpage_group'
            });
            fieldClass.updateBreakType({ breakType: 'STARTCOL' })
            setFieldReport(fieldClass, 'fieldClass');

            // Número de activo alternativo - Placa
            let fieldNumeroActivoAlternativo = form.addField({
                id: 'custpage_field_filter_numero_activo_alternativo',
                label: 'Placa',
                type: 'text',
                container: 'custpage_group'
            })
            fieldNumeroActivoAlternativo.updateBreakType({ breakType: 'STARTCOL' })

            // Nombre
            let fieldNombre = form.addField({
                id: 'custpage_field_filter_nombre',
                label: 'Nombre',
                type: 'text',
                container: 'custpage_group'
            })
            fieldNombre.updateBreakType({ breakType: 'STARTCOL' })

            // Estado Acción
            let fieldEstadoAccion = form.addField({
                id: 'custpage_field_filter_estado_accion',
                label: 'Estado',
                type: 'select',
                // source: 'customlist_bio_lis_est_acc_con_act',
                container: 'custpage_group'
            })
            fieldEstadoAccion.updateBreakType({ breakType: 'STARTCOL' })
            fieldEstadoAccion.updateDisplaySize({ height: 60, width: 120 });
            setFieldReport(fieldEstadoAccion, 'fieldEstadoAccion');

            return { form, fieldAssetType, fieldSubsidiary, fieldClass, fieldNumeroActivoAlternativo, fieldNombre, fieldEstadoAccion }
        }

        function setFieldReport(field, name) {
            // Obtener datos por search
            let dataList = [];

            if (name == 'fieldAssetType') {
                dataList = objSearch.getAssetTypeList();
            } else if (name == 'fieldClass') {
                dataList = objSearch.getClassList();
            } else if (name == 'fieldEstadoAccion') {
                dataList = objSearch.getEstadoAccionList();
            }

            // Setear un primer valor vacio
            if (name == 'fieldEstadoAccion') {
                field.addSelectOption({
                    value: '@NONE@',
                    text: 'PENDIENTE'
                });
            } else {
                field.addSelectOption({
                    value: '',
                    text: ''
                });
            }

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            dataList.forEach((element, i) => {
                field.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        function createSublist(form, dataActivosFijos) {
            // Tipo de sublista
            sublistType = serverWidget.SublistType.LIST;

            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_lista_activos',
                type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                label: 'Lista de activos',
                tab: 'custpage_subtab'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_id', type: serverWidget.FieldType.TEXT, label: 'ID' });
            sublist.addField({ id: 'custpage_editar', type: serverWidget.FieldType.TEXT, label: 'Editar' });
            sublist.addField({ id: 'custpage_transaccion', type: serverWidget.FieldType.TEXT, label: 'Transacción' });
            sublist.addField({ id: 'custpage_tipo_activo', type: serverWidget.FieldType.TEXT, label: 'Tipo de Activo' });
            sublist.addField({ id: 'custpage_nombre', type: serverWidget.FieldType.TEXT, label: 'Nombre' });
            // sublist.addField({ id: 'custpage_descripcion', type: serverWidget.FieldType.TEXT, label: 'Descripción' });
            sublist.addField({ id: 'custpage_marca', type: serverWidget.FieldType.TEXT, label: 'Marca' });
            sublist.addField({ id: 'custpage_modelo', type: serverWidget.FieldType.TEXT, label: 'Modelo' });
            sublist.addField({ id: 'custpage_serie', type: serverWidget.FieldType.TEXT, label: 'Serie' });
            sublist.addField({ id: 'custpage_proveedor', type: serverWidget.FieldType.TEXT, label: 'Proveedor' });
            sublist.addField({ id: 'custpage_fecha_compra', type: serverWidget.FieldType.TEXT, label: 'Fecha Compra' });
            sublist.addField({ id: 'custpage_costo_original', type: serverWidget.FieldType.TEXT, label: 'Costo Original' });
            sublist.addField({ id: 'custpage_clase', type: serverWidget.FieldType.TEXT, label: 'Centro de Costo' }); // Clase
            sublist.addField({ id: 'custpage_numero_activo_alternativo', type: serverWidget.FieldType.TEXT, label: 'Placa' }); // Número de activo alternativo
            sublist.addField({ id: 'custpage_cantidad_factura', type: serverWidget.FieldType.TEXT, label: 'Cantidad Factura' });
            sublist.addField({ id: 'custpage_usuario_depositario', type: serverWidget.FieldType.TEXT, label: 'Usuario' }); // Usuario (Depositario)
            sublist.addField({ id: 'custpage_estado_accion', type: serverWidget.FieldType.TEXT, label: 'Estado Acción' });
            sublist.addField({ id: 'custpage_estado_activo', type: serverWidget.FieldType.TEXT, label: 'Estado Activo' });

            // Setear los datos obtenidos a sublista
            dataActivosFijos.forEach((element, i) => {
                let { suitelet } = objHelper.getUrlSuiteletDetail(element.activo_fijo.id_interno);

                if (element.activo_fijo.id) {
                    sublist.setSublistValue({ id: 'custpage_id', line: i, value: element.activo_fijo.id });
                }
                if (element.activo_fijo.id_interno) {
                    sublist.setSublistValue({ id: 'custpage_editar', line: i, value: `<a href="${suitelet}" target="_blank">Editar</a>` });
                }
                if (element.factura_compra.numero_documento) {
                    sublist.setSublistValue({ id: 'custpage_transaccion', line: i, value: element.factura_compra.numero_documento });
                }
                if (element.tipo_activo.nombre) {
                    sublist.setSublistValue({ id: 'custpage_tipo_activo', line: i, value: element.tipo_activo.nombre });
                }
                if (element.activo_fijo.nombre) {
                    sublist.setSublistValue({ id: 'custpage_nombre', line: i, value: element.activo_fijo.nombre });
                }
                // if (element.descripcion_activo) {
                //     sublist.setSublistValue({ id: 'custpage_descripcion', line: i, value: element.descripcion_activo });
                // }
                if (element.marca) {
                    sublist.setSublistValue({ id: 'custpage_marca', line: i, value: element.marca });
                }
                if (element.modelo) {
                    sublist.setSublistValue({ id: 'custpage_modelo', line: i, value: element.modelo });
                }
                if (element.serie) {
                    sublist.setSublistValue({ id: 'custpage_serie', line: i, value: element.serie });
                }
                if (element.proveedor) {
                    sublist.setSublistValue({ id: 'custpage_proveedor', line: i, value: element.proveedor });
                }
                if (element.fecha_compra) {
                    sublist.setSublistValue({ id: 'custpage_fecha_compra', line: i, value: element.fecha_compra });
                }
                if (element.costo_original) {
                    sublist.setSublistValue({ id: 'custpage_costo_original', line: i, value: element.costo_original });
                }
                if (element.centro_costo.nombre) {
                    sublist.setSublistValue({ id: 'custpage_clase', line: i, value: element.centro_costo.nombre });
                }
                if (element.numero_activo_alternativo) {
                    sublist.setSublistValue({ id: 'custpage_numero_activo_alternativo', line: i, value: element.numero_activo_alternativo });
                }
                if (element.cantidad_factura) {
                    sublist.setSublistValue({ id: 'custpage_cantidad_factura', line: i, value: element.cantidad_factura });
                }
                if (element.usuario_depositario.nombre) {
                    sublist.setSublistValue({ id: 'custpage_usuario_depositario', line: i, value: element.usuario_depositario.nombre });
                }
                if (element.estado_accion.nombre) {
                    sublist.setSublistValue({ id: 'custpage_estado_accion', line: i, value: element.estado_accion.nombre });
                }
                if (element.estado_activo.nombre) {
                    sublist.setSublistValue({ id: 'custpage_estado_activo', line: i, value: element.estado_activo.nombre });
                }
            });
        }

        /****************** Suitelet Detail ******************/
        function createFormDetail(dataActivoFijo) {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administración y control de activo`,
                // title: `Administración y control de activo: ${dataActivoFijo[0].activo_fijo.id} ${dataActivoFijo[0].activo_fijo.nombre}`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath.suiteletDetail;

            // Mostrar botones
            form.addSubmitButton({
                label: 'Guardar'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab',
                label: 'Detalle de activo'
            });

            /****************** Activo fijo ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_actfij',
                    label: 'Activo fijo',
                    tab: 'custpage_subtab'
                });

                // Activo Fijo ID interno
                var fieldActivoFijoIdInterno = form.addField({
                    id: 'custpage_field_activo_fijo_id_interno',
                    label: 'Activo Fijo ID interno',
                    type: 'text',
                    container: 'custpage_group_actfij'
                });
                fieldActivoFijoIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

                // Estado Acción ID interno
                var fieldEstadoAccionIdInterno = form.addField({
                    id: 'custpage_field_estado_accion_id_interno',
                    label: 'Estado Accion ID interno',
                    type: 'text',
                    container: 'custpage_group_actfij'
                });
                fieldEstadoAccionIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

                // Centro de Costo ID interno
                var fieldClaseIdInterno = form.addField({
                    id: 'custpage_field_clase_id_interno',
                    label: 'Centro de Costo ID interno',
                    type: 'text',
                    container: 'custpage_group_actfij'
                });
                fieldClaseIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

                // Estado Acción
                var fieldEstadoAccion = form.addField({
                    id: 'custpage_field_estado_accion',
                    label: 'Estado Acción',
                    type: 'select',
                    // source: 'customlist_bio_lis_est_acc_con_act',
                    container: 'custpage_group_actfij'
                });
                fieldEstadoAccion.updateBreakType({ breakType: 'STARTCOL' })
                setFieldDetail(fieldEstadoAccion, 'fieldEstadoAccion');

                // Fecha de Formato
                var fieldFechaFormato = form.addField({
                    id: 'custpage_field_fecha_formato',
                    label: 'Fecha de Formato',
                    type: 'date',
                    container: 'custpage_group_actfij'
                });
                fieldFechaFormato.updateBreakType({ breakType: 'STARTCOL' })
                fieldFechaFormato.updateDisplayType({ displayType: 'INLINE' });;
            }

            /****************** Datos del proveedor ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_datpro',
                    label: 'Datos del proveedor',
                    tab: 'custpage_subtab'
                });

                // Proveedor
                var fieldProveedor = form.addField({
                    id: 'custpage_field_proveedor',
                    label: 'Proveedor',
                    type: 'text',
                    container: 'custpage_group_datpro'
                });
                fieldProveedor.updateBreakType({ breakType: 'STARTCOL' })
                fieldProveedor.updateDisplayType({ displayType: 'INLINE' });

                // Orden de Compra
                var fieldOrdenCompra = form.addField({
                    id: 'custpage_field_orden_compra',
                    label: 'Orden de Compra',
                    type: 'select',
                    source: 'purchaseorder',
                    container: 'custpage_group_datpro'
                });
                fieldOrdenCompra.updateBreakType({ breakType: 'STARTROW' })
                fieldOrdenCompra.updateDisplayType({ displayType: 'INLINE' });

                // Fecha de compra
                var fieldFechaCompra = form.addField({
                    id: 'custpage_field_fecha_compra',
                    label: 'Fecha de compra',
                    type: 'date',
                    container: 'custpage_group_datpro'
                });
                fieldFechaCompra.updateBreakType({ breakType: 'STARTCOL' })
                fieldFechaCompra.updateDisplayType({ displayType: 'INLINE' });

                // Transacción
                var fieldTransaccion = form.addField({
                    id: 'custpage_field_transaccion',
                    label: 'Transacción',
                    type: 'text',
                    container: 'custpage_group_datpro'
                });
                fieldTransaccion.updateBreakType({ breakType: 'STARTROW' })
                fieldTransaccion.updateDisplayType({ displayType: 'INLINE' });

                // Costo original
                var fieldCostoOriginal = form.addField({
                    id: 'custpage_field_costo_original',
                    label: 'Costo original',
                    type: 'currency',
                    container: 'custpage_group_datpro'
                });
                fieldCostoOriginal.updateBreakType({ breakType: 'STARTROW' })
                fieldCostoOriginal.updateDisplayType({ displayType: 'INLINE' });

                // Número de activo alternativo
                var fieldNumeroActivoAlternativo = form.addField({
                    id: 'custpage_field_numero_activo_alternativo',
                    label: 'Número de activo alternativo',
                    type: 'text',
                    container: 'custpage_group_datpro'
                });
                fieldNumeroActivoAlternativo.updateBreakType({ breakType: 'STARTCOL' })
                fieldNumeroActivoAlternativo.updateDisplayType({ displayType: 'INLINE' });

                // Cantidad Factura
                var fieldCantidadFactura = form.addField({
                    id: 'custpage_field_cantidad_factura',
                    label: 'Cantidad Factura',
                    type: 'text',
                    container: 'custpage_group_datpro'
                });
                fieldCantidadFactura.updateBreakType({ breakType: 'STARTROW' })
                fieldCantidadFactura.updateDisplayType({ displayType: 'INLINE' });

                // Número de guía
                var fieldNumeroGuia = form.addField({
                    id: 'custpage_field_numero_guia',
                    label: 'Número de guía',
                    type: 'text',
                    container: 'custpage_group_datpro'
                });
                fieldNumeroGuia.updateBreakType({ breakType: 'STARTROW' })
            }

            /****************** Datos del bien ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_datbie',
                    label: 'Datos del bien',
                    tab: 'custpage_subtab'
                });

                // Tipo de activo
                var fieldTipoActivo = form.addField({
                    id: 'custpage_field_tipo_activo',
                    label: 'Tipo de activo',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldTipoActivo.updateBreakType({ breakType: 'STARTCOL' })
                fieldTipoActivo.updateDisplayType({ displayType: 'INLINE' });

                // Activo Fijo
                var fieldActivoFijo = form.addField({
                    id: 'custpage_field_activo_fijo',
                    label: 'Activo Fijo',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldActivoFijo.updateBreakType({ breakType: 'STARTROW' })
                fieldActivoFijo.updateDisplayType({ displayType: 'INLINE' });

                // Descripción
                var fieldDescripcion = form.addField({
                    id: 'custpage_field_descripcion',
                    label: 'Descripción',
                    type: 'textarea',
                    container: 'custpage_group_datbie'
                });
                fieldDescripcion.updateBreakType({ breakType: 'STARTROW' })
                fieldDescripcion.updateDisplayType({ displayType: 'INLINE' });

                // Estado Activo
                var fieldEstadoActivo = form.addField({
                    id: 'custpage_field_estado_activo',
                    label: 'Estado Activo',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldEstadoActivo.updateBreakType({ breakType: 'STARTROW' })
                fieldEstadoActivo.updateDisplayType({ displayType: 'INLINE' });

                // Centro de Costo
                var fieldClase = form.addField({
                    id: 'custpage_field_clase',
                    label: 'Centro de Costo',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldClase.updateBreakType({ breakType: 'STARTCOL' })
                fieldClase.updateDisplayType({ displayType: 'INLINE' });

                // Marca
                var fieldMarca = form.addField({
                    id: 'custpage_field_marca',
                    label: 'Marca',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldMarca.updateBreakType({ breakType: 'STARTROW' })

                // Modelo
                var fieldModelo = form.addField({
                    id: 'custpage_field_modelo',
                    label: 'Modelo',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldModelo.updateBreakType({ breakType: 'STARTROW' })

                // Fecha de Uso
                var fieldFechaUso = form.addField({
                    id: 'custpage_field_fecha_uso',
                    label: 'Fecha de Uso',
                    type: 'date',
                    container: 'custpage_group_datbie'
                });
                fieldFechaUso.updateBreakType({ breakType: 'STARTCOL' })

                // Fecha de Placa
                var fieldFechaPlaca = form.addField({
                    id: 'custpage_field_fecha_placa',
                    label: 'Fecha de Placa',
                    type: 'date',
                    container: 'custpage_group_datbie'
                });
                fieldFechaPlaca.updateBreakType({ breakType: 'STARTROW' })

                // N. Serie
                var fieldSerie = form.addField({
                    id: 'custpage_field_nserie',
                    label: 'N. Serie (ACTUALIZA CAMPO EXISTENTE)',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldSerie.updateBreakType({ breakType: 'STARTROW' })

                // Usuario (Depositario) - Usuario
                var fieldUsuarioDepositario = form.addField({
                    id: 'custpage_field_usuario_depositario',
                    label: 'Usuario (ACTUALIZA CAMPO EXISTENTE)',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_datbie'
                });
                fieldUsuarioDepositario.updateBreakType({ breakType: 'STARTROW' })

                // Ubicación
                var fieldUbicacion = form.addField({
                    id: 'custpage_field_ubicacion',
                    label: 'Ubicación',
                    type: 'text',
                    container: 'custpage_group_datbie'
                });
                fieldUbicacion.updateBreakType({ breakType: 'STARTCOL' })

                // Estado Bien
                var fieldEstadoBien = form.addField({
                    id: 'custpage_field_estado_bien',
                    label: 'Estado Bien',
                    type: 'select',
                    // source: 'customlist_bio_lis_est_bien_con_act',
                    container: 'custpage_group_datbie'
                });
                fieldEstadoBien.updateBreakType({ breakType: 'STARTROW' })
                setFieldDetail(fieldEstadoBien, 'fieldEstadoBien');

                // Detalle de uso
                var fieldDetalleUso = form.addField({
                    id: 'custpage_field_detalle_uso',
                    label: 'Detalle de uso',
                    type: 'textarea',
                    container: 'custpage_group_datbie'
                });
                fieldDetalleUso.updateBreakType({ breakType: 'STARTROW' })
            }

            /****************** Baja de activo ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_bajact',
                    label: 'Baja de activo',
                    tab: 'custpage_subtab'
                });

                // Motivo de baja
                var fieldMotivoBaja = form.addField({
                    id: 'custpage_field_motivo_baja',
                    label: 'Motivo de baja',
                    type: 'select',
                    // source: 'customlist_bio_lis_mot_baja_con_act',
                    container: 'custpage_group_bajact'
                });
                fieldMotivoBaja.updateBreakType({ breakType: 'STARTCOL' })
                setFieldDetail(fieldMotivoBaja, 'fieldMotivoBaja');

                // Detalle de baja
                var fieldDetalleBaja = form.addField({
                    id: 'custpage_field_detalle_baja',
                    label: 'Detalle de baja',
                    type: 'textarea',
                    container: 'custpage_group_bajact'
                });
                fieldDetalleBaja.updateBreakType({ breakType: 'STARTROW' })

                // * PROCESO DE FIRMA
                // Anterior Centro de Costo
                var fieldAnteriorClase_Baja = form.addField({
                    id: 'custpage_field_anteriorclase_baja',
                    label: 'Centro de Costo',
                    type: 'text',
                    container: 'custpage_group_bajact'
                });
                fieldAnteriorClase_Baja.updateBreakType({ breakType: 'STARTCOL' })
                fieldAnteriorClase_Baja.updateDisplayType({ displayType: 'INLINE' });

                // Usuario firma
                var fieldUsuarioFirma_AnteriorClase_Baja = form.addField({
                    id: 'custpage_field_usuariofirma_anteriorclase_baja',
                    label: 'Usuario firma',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_bajact'
                });
                fieldUsuarioFirma_AnteriorClase_Baja.updateBreakType({ breakType: 'STARTROW' })
                fieldUsuarioFirma_AnteriorClase_Baja.updateDisplayType({ displayType: 'INLINE' });

                // Fecha firma
                var fieldFechaFirma_AnteriorClase_Baja = form.addField({
                    id: 'custpage_field_fechafirma_anteriorclase_baja',
                    label: 'Fecha firma',
                    type: 'text',
                    container: 'custpage_group_bajact'
                });
                fieldFechaFirma_AnteriorClase_Baja.updateBreakType({ breakType: 'STARTROW' })
                fieldFechaFirma_AnteriorClase_Baja.updateDisplayType({ displayType: 'INLINE' });

                // Boton
                var botonAnteriorClase_Baja = form.addField({
                    id: 'custpage_boton_anteriorclase_baja',
                    label: 'Firmar',
                    type: 'inlinehtml',
                    container: 'custpage_group_bajact'
                });
                botonAnteriorClase_Baja.updateBreakType({ breakType: 'STARTROW' })
                botonAnteriorClase_Baja.updateDisplayType({ displayType: 'HIDDEN' });
                setButtonDetail(botonAnteriorClase_Baja, 'botonAnteriorClase_Baja');
                // * CERRAR

                // Archivo de baja
                var fieldArchivoBaja = form.addField({
                    id: 'custpage_field_archivo_baja',
                    label: 'Archivo de baja',
                    type: 'file',
                });
                fieldArchivoBaja.updateBreakType({ breakType: 'STARTCOL' })

                form.insertField({
                    field: fieldArchivoBaja,
                    nextfield: 'custpage_field_anteriorclase_baja'
                });
            }

            /****************** Transferencia de activo ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_traact',
                    label: 'Transferencia de activo',
                    tab: 'custpage_subtab'
                });

                // * PROCESO DE FIRMA
                // Anterior Centro de Costo
                var fieldAnteriorClase_Transferencia = form.addField({
                    id: 'custpage_field_anteriorclase_transferencia',
                    label: 'Centro de Costo',
                    type: 'text',
                    container: 'custpage_group_traact'
                });
                fieldAnteriorClase_Transferencia.updateBreakType({ breakType: 'STARTCOL' })
                fieldAnteriorClase_Transferencia.updateDisplayType({ displayType: 'INLINE' });

                // Usuario firma
                var fieldUsuarioFirma_AnteriorClase_Transferencia = form.addField({
                    id: 'custpage_field_usuariofirma_anteriorclase_transferencia',
                    label: 'Usuario firma',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_traact'
                });
                fieldUsuarioFirma_AnteriorClase_Transferencia.updateBreakType({ breakType: 'STARTROW' })
                fieldUsuarioFirma_AnteriorClase_Transferencia.updateDisplayType({ displayType: 'INLINE' });

                // Fecha firma
                var fieldFechaFirma_AnteriorClase_Transferencia = form.addField({
                    id: 'custpage_field_fechafirma_anteriorclase_transferencia',
                    label: 'Fecha firma',
                    type: 'text',
                    container: 'custpage_group_traact'
                });
                fieldFechaFirma_AnteriorClase_Transferencia.updateBreakType({ breakType: 'STARTROW' })
                fieldFechaFirma_AnteriorClase_Transferencia.updateDisplayType({ displayType: 'INLINE' });

                // Boton
                var botonAnteriorClase_Transferencia = form.addField({
                    id: 'custpage_boton_anteriorclase_transferencia',
                    label: 'Firmar',
                    type: 'inlinehtml',
                    container: 'custpage_group_traact'
                });
                botonAnteriorClase_Transferencia.updateBreakType({ breakType: 'STARTROW' })
                botonAnteriorClase_Transferencia.updateDisplayType({ displayType: 'HIDDEN' });
                setButtonDetail(botonAnteriorClase_Transferencia, 'botonAnteriorClase_Transferencia');
                // * CERRAR

                // * PROCESO DE FIRMA
                // Nuevo Centro de Costo
                var fieldNuevaClase_Transferencia = form.addField({
                    id: 'custpage_field_nuevaclase_transferencia',
                    label: 'Nuevo Centro de Costo',
                    type: 'select',
                    source: 'classification',
                    container: 'custpage_group_traact'
                });
                fieldNuevaClase_Transferencia.updateBreakType({ breakType: 'STARTCOL' })

                // Usuario firma
                var fieldUsuarioFirma_NuevaClase_Transferencia = form.addField({
                    id: 'custpage_field_usuariofirma_nuevaclase_transferencia',
                    label: 'Usuario firma',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_traact'
                });
                fieldUsuarioFirma_NuevaClase_Transferencia.updateBreakType({ breakType: 'STARTROW' })
                fieldUsuarioFirma_NuevaClase_Transferencia.updateDisplayType({ displayType: 'INLINE' });

                // Fecha firma
                var fieldFechaFirma_NuevaClase_Transferencia = form.addField({
                    id: 'custpage_field_fechafirma_nuevaclase_transferencia',
                    label: 'Fecha firma',
                    type: 'text',
                    container: 'custpage_group_traact'
                });
                fieldFechaFirma_NuevaClase_Transferencia.updateBreakType({ breakType: 'STARTROW' })
                fieldFechaFirma_NuevaClase_Transferencia.updateDisplayType({ displayType: 'INLINE' });

                // Boton
                var botonNuevaClase_Transferencia = form.addField({
                    id: 'custpage_boton_nuevaclase_transferencia',
                    label: 'Firmar',
                    type: 'inlinehtml',
                    container: 'custpage_group_traact'
                });
                botonNuevaClase_Transferencia.updateBreakType({ breakType: 'STARTROW' })
                botonNuevaClase_Transferencia.updateDisplayType({ displayType: 'HIDDEN' });
                setButtonDetail(botonNuevaClase_Transferencia, 'botonNuevaClase_Transferencia');
                // * CERRAR

                // Nueva Ubicacion
                var fieldNuevaUbicacion = form.addField({
                    id: 'custpage_field_nueva_ubicacion',
                    label: 'Nueva Ubicación',
                    type: 'text',
                    container: 'custpage_group_traact'
                });
                fieldNuevaUbicacion.updateBreakType({ breakType: 'STARTCOL' })

                // Nuevo Usuario (Depositario)
                var fieldNuevoUsuarioDepositario = form.addField({
                    id: 'custpage_field_nuevo_usuario_depositario',
                    label: 'Nuevo Usuario (Depositario)',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_traact'
                });
                fieldNuevoUsuarioDepositario.updateBreakType({ breakType: 'STARTROW' })
            }

            return {
                form,
                // IDs internos
                fieldActivoFijoIdInterno,
                fieldEstadoAccionIdInterno,
                fieldClaseIdInterno,
                // Activo fijo
                fieldEstadoAccion,
                fieldFechaFormato,
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
                fieldFechaUso,
                fieldFechaPlaca,
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
            }
        }

        function setFieldDetail(field, name) {
            // Obtener datos por search
            let dataList = [];

            if (name == 'fieldEstadoAccion') {
                dataList = objSearch.getEstadoAccionList();
            } else if (name == 'fieldEstadoBien') {
                dataList = objSearch.getEstadoBienList();
            } else if (name == 'fieldMotivoBaja') {
                dataList = objSearch.getMotivoBajaList();
            }

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            dataList.forEach((element, i) => {
                field.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        function setButtonDetail(button, name) {
            let html = '';

            let htmlSolicitudHTTP = `
                let scriptId = 'customscript_bio_sl_api_control_fix_ass';
                let deployId = 'customdeploy_bio_sl_api_control_fix_ass';

                // Obtener el id interno del activo fijo
                let recordContext = currentRecord.get();
                let fixedasset_id = recordContext.getValue('custpage_field_activo_fijo_id_interno');

                // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
                let suitelet = url.resolveScript({
                    deploymentId: deployId,
                    scriptId: scriptId
                });

                // Solicitud HTTP
                let response = https.post({
                    url: suitelet,
                    body: JSON.stringify({
                        _method: method,
                        _fixedasset_id: fixedasset_id
                    })
                });
                let responseData = JSON.parse(response.body);
                console.log('responseData', responseData);

                if (responseData.status == 'success' && responseData.suitelet) {

                    // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
                    setWindowChanged(window, false);

                    // Redirigir a la url
                    window.location.href = responseData.suitelet;
                }
            `;

            if (name == 'botonAnteriorClase_Baja') {

                html = `
                    <script>
                        function firmarAnteriorClase_Baja() {

                            if (confirm('¿Estás seguro de que quieres firmar?')) {

                                require(['N/currentRecord', 'N/url', 'N/https', 'N/http'], function (currentRecord, url, https, http) {
                                    console.log('firmarAnteriorClase_Baja');
                                    let method = 'firmarAnteriorClase_Baja';

                                    // Solicitud HTTP
                                    ${htmlSolicitudHTTP}
                                });
                            }
                        }
                    </script>
                    <button type="button" class="pgBntG pgBntB" style="padding: 3px 12px;" onClick="firmarAnteriorClase_Baja()">Firmar</button>
                `;
            } else if (name == 'botonAnteriorClase_Transferencia') {

                html = `
                    <script>
                        function firmarAnteriorClase_Transferencia() {

                            if (confirm('¿Estás seguro de que quieres firmar?')) {

                                require(['N/currentRecord', 'N/url', 'N/https', 'N/http'], function (currentRecord, url, https, http) {
                                    console.log('firmarAnteriorClase_Transferencia');
                                    let method = 'firmarAnteriorClase_Transferencia';

                                    // Solicitud HTTP
                                    ${htmlSolicitudHTTP}
                                });
                            }
                        }
                    </script>
                    <button type="button" class="pgBntG pgBntB" style="padding: 3px 12px;" onClick="firmarAnteriorClase_Transferencia()">Firmar</button>
                `;
            } else if (name == 'botonNuevaClase_Transferencia') {

                html = `
                    <script>
                        function firmarNuevaClase_Transferencia() {

                            if (confirm('¿Estás seguro de que quieres firmar?')) {

                                require(['N/currentRecord', 'N/url', 'N/https', 'N/http'], function (currentRecord, url, https, http) {
                                    console.log('firmarNuevaClase_Transferencia');
                                    let method = 'firmarNuevaClase_Transferencia';

                                    // Solicitud HTTP
                                    ${htmlSolicitudHTTP}
                                });
                            }
                        }
                    </script>
                    <button type="button" class="pgBntG pgBntB" style="padding: 3px 12px;" onClick="firmarNuevaClase_Transferencia()">Firmar</button>
                `;
            }

            button.defaultValue = html;
        }

        return { createFormReport, createSublist, createFormDetail }

    });