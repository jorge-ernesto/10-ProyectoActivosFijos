// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SS Get Quantity Fixed Assets (customscript_bio_ss_getquafixedassets)

/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Process', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objProcess, objHelper, N) {

        const { log, runtime, email } = N;

        /******************/

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        function execute(scriptContext) {

            // Obtener informacion del ScheduledScript
            let currentScript = runtime.getCurrentScript();
            let subsidiary = currentScript.getParameter({ name: 'custscript_bio_subsidiary' });
            log.debug('subsidiary', subsidiary);

            // Obtener datos por search
            let dataActivosFijos = objSearch.getDataActivosFijos(subsidiary);
            let dataFacturasCompras = objSearch.getDataFacturasCompras(dataActivosFijos);
            let dataActivosFijosPorActualizar = objProcess.getProcess(dataActivosFijos, dataFacturasCompras);
            objProcess.setUpdate(dataActivosFijosPorActualizar);

            // Debug
            // objHelper.email_log('dataActivosFijos', dataActivosFijos);
            // objHelper.email_log('dataFacturasCompras', dataFacturasCompras);
            // objHelper.email_log('dataActivosFijosPorActualizar', dataActivosFijosPorActualizar);

            /****************** Email ******************/
            // Enviar email
            // let user = runtime.getCurrentUser();

            // email.send({
            //     author: user.id,
            //     recipients: user.id,
            //     subject: 'Proceso - Actualizar cantidades de activos fijos',
            //     body: 'Proceso finalizado'
            // });
        }

        return { execute }

    });