// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL API Control Fixed Assets (customscript_bio_sl_api_control_fix_ass)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, record, runtime, format, url } = N;

        const scriptId = 'customscript_bio_sl_con_fixed_assets_det';
        const deployId = 'customdeploy_bio_sl_con_fixed_assets_det';

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // Debug
            // scriptContext.response.setHeader('Content-type', 'application/json');
            // scriptContext.response.write(JSON.stringify(scriptContext));
            // return;

            // Debug
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameters', scriptContext.request.parameters);
            // log.debug('body', scriptContext.body);
            // return;

            if (scriptContext.request.method == 'POST') {

                // Obtener datos enviados por peticion HTTP
                let data = JSON.parse(scriptContext.request.body);
                let method = data._method || null;

                if (method) {

                    // Obtener datos
                    let fixedasset_id = data._fixedasset_id || null;

                    // Obtener el record del proyecto
                    let fixedassetRecord = fixedasset_id ? record.load({ type: 'customrecord_ncfar_asset', id: fixedasset_id }) : null;

                    // Obtener el usuario logueado
                    let user = runtime.getCurrentUser();

                    // Obtener fecha y hora actual
                    var now = new Date();
                    var datetime = format.format({ value: now, type: format.Type.DATETIME });

                    // Respuesta
                    let response = {
                        code: '400',
                        status: 'error',
                        method: method
                    };

                    // El control de errores comienza aca para tener acceso a method y response
                    try {
                        // Debug
                        // objHelper.error_log('test err', response);

                        if (method == 'firmarAnteriorClase_Baja' && fixedassetRecord) {

                            // Setear datos al record
                            fixedassetRecord.setValue('custrecord_bio_usufir_baja_con_act', user.id);
                            fixedassetRecord.setValue('custrecord_bio_fecfir_baja_con_act', datetime);
                            let fixedassetId = fixedassetRecord.save();
                            log.debug('firmarAnteriorClase_Baja', fixedassetRecord);

                            if (fixedassetId) {
                                // Obtener url del Suitelet
                                let suitelet = url.resolveScript({
                                    deploymentId: deployId,
                                    scriptId: scriptId,
                                    params: {
                                        _id: fixedassetId,
                                        _status: 'PROCESS_SIGNATURE'
                                    }
                                })

                                // Respuesta
                                response = {
                                    code: '200',
                                    status: 'success',
                                    method: method,
                                    // fixedassetRecord: fixedassetRecord, // Retorna con informacion rara al final del JSON, lo cual no permite convertir de String A JSON, JSON.parse(response.body);
                                    fixedassetId: fixedassetId,
                                    suitelet: suitelet
                                };
                            }
                        } else if (method == 'firmarAnteriorClase_Transferencia' && fixedassetRecord) {

                            // Setear datos al record
                            fixedassetRecord.setValue('custrecord_bio_usufirantcc_trans_con_act', user.id);
                            fixedassetRecord.setValue('custrecord_bio_fecfirantcc_trans_con_act', datetime);
                            let fixedassetId = fixedassetRecord.save();
                            log.debug('firmarAnteriorClase_Transferencia', fixedassetRecord);

                            if (fixedassetId) {
                                // Obtener url del Suitelet
                                let suitelet = url.resolveScript({
                                    deploymentId: deployId,
                                    scriptId: scriptId,
                                    params: {
                                        _id: fixedassetId,
                                        _status: 'PROCESS_SIGNATURE'
                                    }
                                })

                                // Respuesta
                                response = {
                                    code: '200',
                                    status: 'success',
                                    method: method,
                                    // fixedassetRecord: fixedassetRecord, // Retorna con informacion rara al final del JSON, lo cual no permite convertir de String A JSON, JSON.parse(response.body);
                                    fixedassetId: fixedassetId,
                                    suitelet: suitelet
                                };
                            }
                        } else if (method == 'firmarNuevaClase_Transferencia' && fixedassetRecord) {

                            // Setear datos al record
                            fixedassetRecord.setValue('custrecord_bio_usufirnuecc_trans_con_act', user.id);
                            fixedassetRecord.setValue('custrecord_bio_fecfirnuecc_trans_con_act', datetime);
                            let fixedassetId = fixedassetRecord.save();
                            log.debug('firmarNuevaClase_Transferencia', fixedassetRecord);

                            if (fixedassetId) {
                                // Obtener url del Suitelet
                                let suitelet = url.resolveScript({
                                    deploymentId: deployId,
                                    scriptId: scriptId,
                                    params: {
                                        _id: fixedassetId,
                                        _status: 'PROCESS_SIGNATURE'
                                    }
                                })

                                // Respuesta
                                response = {
                                    code: '200',
                                    status: 'success',
                                    method: method,
                                    // fixedassetRecord: fixedassetRecord, // Retorna con informacion rara al final del JSON, lo cual no permite convertir de String A JSON, JSON.parse(response.body);
                                    fixedassetId: fixedassetId,
                                    suitelet: suitelet
                                };
                            }
                        }
                    } catch (err) {
                        // Respuesta
                        response = {
                            code: '400',
                            status: 'error',
                            method: method,
                            err: err
                        };
                    }

                    // Respuesta
                    scriptContext.response.setHeader('Content-type', 'application/json');
                    scriptContext.response.write(JSON.stringify(response));
                }
            }
        }

        return { onRequest }

    });
