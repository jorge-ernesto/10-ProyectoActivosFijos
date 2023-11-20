
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, runtime, email, url } = N;

        const scriptId = 'customscript_bio_sl_con_fixed_assets_det';
        const deployId = 'customdeploy_bio_sl_con_fixed_assets_det';

        /******************/

        function getUser() {
            let user = runtime.getCurrentUser();
            return { user };
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
                author: user.id,
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
                author: user.id,
                recipients: usersId,
                subject: 'Transferencia de Activo Fijo',
                body: `
                    Se solicitó la transferencia del Activo Fijo <b>${fixedAsset.getValue('name')}.</b><br /><br />
                    Se espera su aprobación: <a href="${suitelet}" target="_blank">${fixedAsset.getValue('name')}</a>
                `
            });
        }

        return { getUser, error_log, email_log, getUrlSuiteletDetail, sendEmailBaja, sendEmailTransferencia }

    });
