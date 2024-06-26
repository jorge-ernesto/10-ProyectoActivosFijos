
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, runtime, format, email, url } = N;

        const scriptId = 'customscript_bio_sl_con_fixed_assets_det';
        const deployId = 'customdeploy_bio_sl_con_fixed_assets_det';

        /******************/

        function getUser() {
            let user = runtime.getCurrentUser();
            return { user };
        }

        function getDate() {
            var now = new Date();
            var date = format.format({ value: now, type: format.Type.DATE });
            return date;
        }

        function error_log(title, data) {
            throw `${title} -- ${JSON.stringify(data)}`;
        }

        function email_log(title, data) {
            let user = runtime.getCurrentUser();
            email.send({
                author: user.id,
                recipients: user.id,
                subject: title,
                body: `<pre>${JSON.stringify(data)}</pre>`,
            })
        }

        /******************/

        function getUrlSuiteletDetail(id) {

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId,
                params: {
                    _id: id
                }
            })

            return { suitelet };
        }

        function sendEmailBaja(usersId, fixedAsset) {

            let { user } = getUser();
            let { suitelet } = getUrlSuiteletDetail(fixedAsset.getValue('id'));

            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                // author: user.id, // Usuario logueado
                recipients: usersId,
                subject: `Baja de Activo Fijo`,
                body: `
                    Se solicitó la baja del Activo Fijo <b>${fixedAsset.getValue('name')}.</b><br /><br />
                    Se espera su aprobación: <a href="${suitelet}" target="_blank">${fixedAsset.getValue('name')}</a>
                `
            });
        }

        function sendEmailTransferencia(usersId, fixedAsset) {

            let { user } = getUser();
            let { suitelet } = getUrlSuiteletDetail(fixedAsset.getValue('id'));

            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                // author: user.id, // Usuario logueado
                recipients: usersId,
                subject: 'Transferencia de Activo Fijo',
                body: `
                    Se solicitó la transferencia del Activo Fijo <b>${fixedAsset.getValue('name')}.</b><br /><br />
                    Se espera su aprobación: <a href="${suitelet}" target="_blank">${fixedAsset.getValue('name')}</a>
                `
            });
        }

        function getNameFile(nameFile) {

            // Obtener extensión del archivo
            const extension = nameFile.slice(nameFile.lastIndexOf('.'));

            // Obtener time stamp
            const timeStamp = getTimeStamp();

            // Obtener nuevo nombre
            nameFile = nameFile.replace(extension, `_${timeStamp}${extension}`);

            return nameFile;
        }

        function getTimeStamp() {
            const now = new Date();
            return `${now.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_')}`;
        }

        return { getUser, getDate, error_log, email_log, getUrlSuiteletDetail, sendEmailBaja, sendEmailTransferencia, getNameFile }

    });
