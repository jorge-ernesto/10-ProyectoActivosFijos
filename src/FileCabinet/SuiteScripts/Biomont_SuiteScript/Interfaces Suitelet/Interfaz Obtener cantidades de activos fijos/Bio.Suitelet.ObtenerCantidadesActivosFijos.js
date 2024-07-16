// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Get Quantity Fixed Assets (customscript_bio_sl_getquafixedassets)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N'],

    function (N) {

        const { log, runtime, task, redirect } = N;
        const { serverWidget, message } = N.ui;

        const send_scheduled_script = true;

        /******************/

        // Crear formulario
        function createForm() {
            // Crear mensaje de ayuda
            let htmlContainer = `
            <div style="font-size: 14px">
                <strong>Consideraciones:</strong>
                <ul style="list-style-type: disc; padding-left: 40px;">
                    <li style="margin-bottom: -1%; margin-top: -1%;">Solo se procesarán Activos Fijos con el estado "Nuevo"</li>
                    <li style="margin-bottom: -1%">Solo se procesarán Activos Fijos que tengan relacionada una Factura de Compra</li>
                    <li style="margin-bottom: -1%">Solo se procesarán Activos Fijos que no han sido procesados</li>
                    <li style="margin-bottom: -1%">La relación de Activo Fijo y Factura de Compra se realiza por el Centro de Costo (por lo que es necesario que esté registrado)</li>
                    <li>Solo se actualizará la cantidad de Activos Fijos si la cantidad encontrada en la Factura de Compra es menor a 1</li>
                </ul>
            </div>
        `;

            // Crear formulario
            let form = serverWidget.createForm({
                title: `Obtener cantidades de activos ${htmlContainer}`,
                hideNavbar: false
            })

            // Mostrar botones
            form.addSubmitButton({
                label: 'Procesar'
            })

            // Mostrar Grupo de Campos
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Filtros',
            })

            // Subsidiaria
            let fieldSubsidiary = form.addField({
                id: 'custpage_field_subsidiary',
                label: 'Subsidiaria',
                type: 'select',
                source: 'subsidiary',
                container: 'custpage_group'
            });
            fieldSubsidiary.updateBreakType({ breakType: 'STARTCOL' })
            fieldSubsidiary.isMandatory = true;

            return { form }
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
                let { form } = createForm();

                // Obtener datos por url
                let status = scriptContext.request.parameters['status'];

                // Si hubo una redireccion a este mismo suitelet - despues de enviar a script programado
                if (status?.includes('COMPLETE')) {
                    form.addPageInitMessage({
                        type: message.Type.INFORMATION,
                        message: `El proceso finalizo correctamente`,
                        duration: 25000
                    });
                } else if (status?.includes('FAILED')) {
                    form.addPageInitMessage({
                        type: message.Type.ERROR,
                        message: `Hubo un error en el proceso`,
                        duration: 25000
                    });
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST
                // Recibir parametros por POST
                let subsidiary = scriptContext.request.parameters['custpage_field_subsidiary'];

                // Enviar a script programado
                if (send_scheduled_script == true) {
                    // Crear tarea - Enviar a ScheduledScript (Script Programado)
                    // Se puede enviar a ScheduledScript, usando task.TaskType.SCHEDULED_SCRIPT
                    // Se puede enviar a MapReduceScript, usando task.TaskType.MAP_REDUCE
                    let taskId = task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                        scriptId: 'customscript_bio_ss_getquafixedassets',
                        deploymentId: 'customdeploy_bio_ss_getquafixedassets',
                        params: {
                            custscript_bio_subsidiary: subsidiary,
                        }
                    }).submit();

                    // Revisar task status
                    // Se usa un bucle while para revisar el estado de forma periodica
                    // Un ScheduledScript tiene dos estados finales "Complete" o "Failed"
                    taskStatus = task.checkStatus({
                        taskId: taskId
                    });
                    log.debug('taskStatus', taskStatus)

                    while (taskStatus.status !== 'COMPLETE') {
                        taskStatus = task.checkStatus({
                            taskId: taskId
                        });
                        log.debug('taskStatus', taskStatus)

                        // Detener bucle en caso de error
                        if (taskStatus.status === 'FAILED') {
                            break;
                        }
                    }
                    log.debug('taskStatus', taskStatus)

                    // Redirigir a este mismo Suitelet (Redirigir a si mismo)
                    redirect.toSuitelet({
                        scriptId: runtime.getCurrentScript().id,
                        deploymentId: runtime.getCurrentScript().deploymentId,
                        parameters: {
                            'status': taskStatus.status
                        }
                    });
                }
            }
        }

        return { onRequest }

    });
