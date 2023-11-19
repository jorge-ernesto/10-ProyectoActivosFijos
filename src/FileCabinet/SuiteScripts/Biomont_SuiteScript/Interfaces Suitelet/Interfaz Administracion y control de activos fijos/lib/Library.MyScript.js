/*
Probar script en la consola de "Set Preferences"

> require(['SuiteScripts/Biomont_SuiteScript/Interfaces Suitelet/Interfaz Administracion y control de activos fijos/lib/Library.MyScript.js'], function(lib){
    Lib = lib;
})
> Lib
> Lib.adjuntarArchivo()
*/

/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, record } = N;

        /******************/

        function adjuntarArchivo() {

            var id = record.attach({
                record: {
                    type: 'file',
                    id: '283387'
                },
                to: {
                    type: 'customrecord_ncfar_asset',
                    id: '44884'
                }
            });
        }

        function actualizarFechaInicioDepreciacion() {

            let activoFijoRecord = record.load({ type: 'customrecord_ncfar_asset', id: 44705 });
            activoFijoRecord.setText('custrecord_assetdeprstartdate', '01/08/2023'); // 01/08/2023 - 31/07/2043
            activoFijoRecord.save();
        }

        return { adjuntarArchivo, actualizarFechaInicioDepreciacion }

    });
