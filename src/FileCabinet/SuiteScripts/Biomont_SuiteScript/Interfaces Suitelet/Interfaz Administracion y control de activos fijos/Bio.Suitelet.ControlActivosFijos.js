// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Control Fixed Assets (customscript_bio_sl_control_fixed_assets)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Widget', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objWidget, objHelper, N) {

        const { log, redirect, runtime } = N;

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
                let { form, fieldAssetType, fieldSubsidiary, fieldClass, fieldNumeroActivoAlternativo, fieldNombre, fieldEstadoAccion } = objWidget.createFormReport();

                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let assettype = scriptContext.request.parameters['_assettype'];
                let subsidiary = scriptContext.request.parameters['_subsidiary'];
                let classification = scriptContext.request.parameters['_classification'];
                let numero_activo_alternativo = scriptContext.request.parameters['_numero_activo_alternativo'];
                let nombre = scriptContext.request.parameters['_nombre'];
                let estado_accion = scriptContext.request.parameters['_estado_accion'];

                if (button == 'consultar') {

                    // Debug
                    // objHelper.error_log('debug', { assettype, subsidiary });

                    // Setear datos al formulario
                    subsidiary = subsidiary.split('|'); // '1|2' -> ['1','2']
                    fieldAssetType.defaultValue = assettype;
                    fieldSubsidiary.defaultValue = subsidiary;
                    fieldClass.defaultValue = classification;
                    fieldNumeroActivoAlternativo.defaultValue = numero_activo_alternativo;
                    fieldNombre.defaultValue = nombre;
                    fieldEstadoAccion.defaultValue = estado_accion;

                    // Obtener datos por search
                    let dataActivosFijos = objSearch.getDataActivosFijos(assettype, subsidiary, classification, numero_activo_alternativo, nombre, estado_accion);

                    // Debug
                    // objHelper.error_log('dataActivosFijos', dataActivosFijos);

                    // Crear sublista
                    objWidget.createSublist(form, dataActivosFijos);
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST

                // Recuperar valores de los campos
                let assettype = scriptContext.request.parameters['custpage_field_filter_assettype'];
                let subsidiary = scriptContext.request.parameters['custpage_field_filter_subsidiary'];
                let classification = scriptContext.request.parameters['custpage_field_filter_class'];
                let numero_activo_alternativo = scriptContext.request.parameters['custpage_field_filter_numero_activo_alternativo'];
                let nombre = scriptContext.request.parameters['custpage_field_filter_nombre'];
                let estado_accion = scriptContext.request.parameters['custpage_field_filter_estado_accion'];

                // Debug
                // objHelper.error_log('debug', { assettype, subsidiary, classification, numero_activo_alternativo, nombre, estado_accion });

                // Redirigir a este mismo Suitelet (Redirigir a si mismo)
                redirect.toSuitelet({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    parameters: {
                        _button: 'consultar',
                        _assettype: assettype,
                        _subsidiary: subsidiary.split('\u0005').join('|'), // '1\u00052' -> '1|2'
                        _classification: classification,
                        _numero_activo_alternativo: numero_activo_alternativo,
                        _nombre: nombre,
                        _estado_accion: estado_accion
                    }
                });
            }
        }

        return { onRequest }

    });
