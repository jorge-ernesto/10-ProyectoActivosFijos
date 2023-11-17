// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Control Fixed Assets (customscript_bio_sl_control_fixed_assets)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Helper', './lib/Bio.Library.Search', 'N'],

    function (objHelper, objSearch, N) {

        const { log, url } = N;
        const { serverWidget } = N.ui;

        const DATA = {
            'clientScriptModulePath': './Bio.Client.ControlActivosFijos.js'
        }

        const scriptId = 'customscript_bio_sl_con_fixed_assets_det';
        const deployId = 'customdeploy_bio_sl_con_fixed_assets_det';

        /******************/

        // Crear formulario
        function createForm() {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administración y control de activos`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath;

            // Mostrar botones
            // form.addSubmitButton({
            //     label: 'Consultar'
            // });
            form.addButton({
                id: 'custpage_button_obtener_activos_fijos',
                label: 'Obtener activos',
                functionName: 'getFixedAssets()'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab',
                label: 'Lista de activos'
            });

            /****************** Mostrar Grupo de Campos ******************/
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Filtros',
                tab: 'custpage_subtab'
            });

            // Tipos de activos
            let fieldAssetType = form.addField({
                id: 'custpage_field_assettype',
                label: 'Tipos de activos',
                type: 'select',
                // source: 'customrecord_ncfar_assettype',
                container: 'custpage_group'
            });
            fieldAssetType.updateBreakType({ breakType: 'STARTCOL' })
            setFieldAssetType(fieldAssetType);

            // Subsidiarias
            let fieldSubsidiary = form.addField({
                id: 'custpage_field_subsidiary',
                label: 'Subsidiarias',
                type: 'multiselect',
                source: 'subsidiary',
                container: 'custpage_group'
            });
            fieldSubsidiary.updateBreakType({ breakType: 'STARTCOL' })

            // Clases
            let fieldClass = form.addField({
                id: 'custpage_field_class',
                label: 'Clases',
                type: 'select',
                // source: 'classification',
                container: 'custpage_group'
            });
            fieldClass.updateBreakType({ breakType: 'STARTCOL' })
            setFieldClass(fieldClass);

            // Número de activo alternativo
            let fieldNumeroActivoAlternativo = form.addField({
                id: 'custpage_field_numero_activo_alternativo',
                label: 'Número de activo alternativo',
                type: 'text',
                container: 'custpage_group'
            })
            fieldNumeroActivoAlternativo.updateBreakType({ breakType: 'STARTCOL' })

            // Nombre
            let fieldNombre = form.addField({
                id: 'custpage_field_nombre',
                label: 'Nombre',
                type: 'text',
                container: 'custpage_group'
            })
            fieldNombre.updateBreakType({ breakType: 'STARTCOL' })

            // Estado Proceso
            let fieldEstadoProceso = form.addField({
                id: 'custpage_field_estado_proceso',
                label: 'Estado Proceso',
                type: 'select',
                // source: 'customlist_bio_lis_est_proc_con_act',
                container: 'custpage_group'
            })
            fieldEstadoProceso.updateBreakType({ breakType: 'STARTCOL' })
            fieldEstadoProceso.updateDisplaySize({ height: 60, width: 100 });
            setFieldEstadoProceso(fieldEstadoProceso);

            return { form, fieldAssetType, fieldSubsidiary, fieldClass, fieldNumeroActivoAlternativo, fieldNombre, fieldEstadoProceso }
        }

        function setFieldAssetType(fieldAssetType) {
            // Obtener datos por search
            let assetTypeList = objSearch.getAssetTypeList();

            // Setear un primer valor vacio
            fieldAssetType.addSelectOption({
                value: '',
                text: ''
            });

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            assetTypeList.forEach((element, i) => {
                fieldAssetType.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        function setFieldClass(fieldClass) {
            // Obtener datos por search
            let classList = objSearch.getClassList();

            // Setear un primer valor vacio
            fieldClass.addSelectOption({
                value: '',
                text: ''
            });

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            classList.forEach((element, i) => {
                fieldClass.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        function setFieldEstadoProceso(fieldEstadoProceso) {
            // Obtener datos por search
            let estadoProcesoList = objSearch.getEstadoProcesoList();

            // Setear un primer valor vacio
            fieldEstadoProceso.addSelectOption({
                value: '',
                text: ''
            });

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            estadoProcesoList.forEach((element, i) => {
                fieldEstadoProceso.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        // Crear sublista
        function createSublist(form, dataActivosFijos) {
            // Tipo de sublista
            sublistType = serverWidget.SublistType.LIST;

            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_md',
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
            sublist.addField({ id: 'custpage_descripcion', type: serverWidget.FieldType.TEXT, label: 'Descripción' });
            sublist.addField({ id: 'custpage_proveedor', type: serverWidget.FieldType.TEXT, label: 'Proveedor' });
            sublist.addField({ id: 'custpage_fecha_compra', type: serverWidget.FieldType.TEXT, label: 'Fecha Compra' });
            sublist.addField({ id: 'custpage_costo_original', type: serverWidget.FieldType.TEXT, label: 'Costo Original' });
            sublist.addField({ id: 'custpage_clase', type: serverWidget.FieldType.TEXT, label: 'Clase' });
            sublist.addField({ id: 'custpage_numero_activo_alternativo', type: serverWidget.FieldType.TEXT, label: 'Número de activo alternativo' });
            sublist.addField({ id: 'custpage_cantidad_factura', type: serverWidget.FieldType.TEXT, label: 'Cantidad Factura' });
            sublist.addField({ id: 'custpage_usuario_depositario', type: serverWidget.FieldType.TEXT, label: 'Usuario (Depositario)' });
            sublist.addField({ id: 'custpage_estado_proceso', type: serverWidget.FieldType.TEXT, label: 'Estado Proceso' });

            // Setear los datos obtenidos a sublista
            dataActivosFijos.forEach((element, i) => {
                let suitelet = url.resolveScript({
                    deploymentId: deployId,
                    scriptId: scriptId,
                    params: {
                        _id: element.activo_fijo.id_interno
                    }
                })

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
                if (element.descripcion_activo) {
                    sublist.setSublistValue({ id: 'custpage_descripcion', line: i, value: element.descripcion_activo });
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
                if (element.estado_proceso.nombre) {
                    sublist.setSublistValue({ id: 'custpage_estado_proceso', line: i, value: element.estado_proceso.nombre });
                }
            });
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

                // Crear formulario
                let { form, fieldAssetType, fieldSubsidiary, fieldClass, fieldNumeroActivoAlternativo, fieldNombre, fieldEstadoProceso } = createForm();

                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let assettype = scriptContext.request.parameters['_assettype'];
                let subsidiary = scriptContext.request.parameters['_subsidiary'];
                let classification = scriptContext.request.parameters['_classification'];
                let numero_activo_alternativo = scriptContext.request.parameters['_numero_activo_alternativo'];
                let nombre = scriptContext.request.parameters['_nombre'];
                let estado_proceso = scriptContext.request.parameters['_estado_proceso'];

                if (button == 'consultar') {

                    // Debug
                    // objHelper.error_log('debug', { assettype, subsidiary });

                    // Setear datos al formulario
                    subsidiary = subsidiary.split('|'); // 1|2 -> ['1','2']
                    fieldAssetType.defaultValue = assettype;
                    fieldSubsidiary.defaultValue = subsidiary;
                    fieldClass.defaultValue = classification;
                    fieldNumeroActivoAlternativo.defaultValue = numero_activo_alternativo;
                    fieldNombre.defaultValue = nombre;
                    fieldEstadoProceso.defaultValue = estado_proceso;

                    // Obtener datos por search
                    let dataActivosFijos = objSearch.getDataActivosFijos(assettype, subsidiary, classification, numero_activo_alternativo, nombre, estado_proceso);

                    // Debug
                    // objHelper.error_log('dataActivosFijos', dataActivosFijos);

                    // Crear sublista
                    createSublist(form, dataActivosFijos);
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            }
        }

        return { onRequest }

    });
