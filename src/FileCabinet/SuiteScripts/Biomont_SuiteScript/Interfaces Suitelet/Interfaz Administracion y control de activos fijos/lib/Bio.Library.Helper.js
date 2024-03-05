
/**
 * @NApiVersion 2.1
 */
define(['N'],

    function (N) {

        const { log, runtime, email } = N;

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

        return { error_log, email_log }

    });
