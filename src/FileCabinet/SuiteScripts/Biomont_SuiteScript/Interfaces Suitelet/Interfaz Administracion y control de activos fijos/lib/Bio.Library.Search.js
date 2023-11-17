/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, search } = N;

        function getDataActivosFijos(assettype = '', subsidiary = [''], classification = '', numero_activo_alternativo = '', nombre = '', estado_proceso = '', id_interno = '') {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_ncfar_asset',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.DESC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "name", label: "ID" }),
                    search.createColumn({ name: "altname", label: "Nombre" }),
                    search.createColumn({ name: "custrecord_assetsourcetrn", label: "Transacción principal" }),
                    search.createColumn({ name: "custrecord_assettype", label: "Tipo de activo" }),
                    search.createColumn({ name: "custrecord_assetdescr", label: "Descripción de activo" }),
                    search.createColumn({ name: "custrecord_assetsupplier", label: "Proveedor" }),
                    search.createColumn({ name: "custrecord_assetpurchasedate", label: "Fecha de compra" }),
                    search.createColumn({ name: "custrecord_assetcost", label: "Costo original del activo" }),
                    search.createColumn({ name: "custrecord_assetstatus", label: "Estado de activo" }),
                    search.createColumn({ name: "custrecord_assetclass", label: "Clase" }),
                    search.createColumn({ name: "custrecord_assetalternateno", label: "Número de activo alternativo" }),
                    search.createColumn({ name: "custrecord_bio_can_fac_obt_can_act_fij", label: "Cantidad Factura" }),
                    search.createColumn({ name: "custrecord_assetcaretaker", label: "Usuario" }),
                    search.createColumn({ name: "custrecord_bio_est_proc_con_act_fij", label: "Estado Proceso (Administración y control de activos)" }),
                    search.createColumn({ name: "custrecord_assetpurchaseorder", label: "Orden de compra" })
                ],
                filters: [
                    ["custrecord_assetstatus", "noneof", "4"] // En el listado, no traer los activos fijos con Estado de Activo "Enajenado"
                ]
            };

            /****************** Filtros por defecto ******************/
            // Filtro de tipo de activo
            if (assettype != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assettype", "anyof", assettype]);
            }

            // Filtro de subsidiary
            if (Array.isArray(subsidiary) && subsidiary[0] != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assetsubsidiary", "anyof"].concat(subsidiary));
            }

            /****************** Filtros adicionales ******************/
            // Filtro de clases
            if (classification != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assetclass", "anyof", classification]);
            }

            // Filtro de número de activo alternativo
            if (numero_activo_alternativo != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assetalternateno", "contains", numero_activo_alternativo]);
            }

            // Filtro de nombre
            if (nombre != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["name", "contains", nombre]);
            }

            // Filtro de estado proceso
            if (estado_proceso != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_bio_est_proc_con_act_fij", "anyof", estado_proceso]);
            }

            // Filtro de id interno
            if (id_interno != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["internalid", "anyof", id_interno]);
            }

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataActivosFijos');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let activo_fijo_id_interno = row.getValue(columns[0]);
                    let activo_id = row.getValue(columns[1]);
                    let activo_nombre = row.getValue(columns[2]);
                    let factura_compra_id_interno = row.getValue(columns[3]);
                    let factura_compra = row.getText(columns[3]);
                    let tipo_activo_id = row.getValue(columns[4]);
                    let tipo_activo_nombre = row.getText(columns[4]);
                    let descripcion_activo = row.getValue(columns[5]);
                    let proveedor = row.getValue(columns[6]);
                    let fecha_compra = row.getValue(columns[7]);
                    let costo_original = row.getValue(columns[8]);
                    let estado_id_interno = row.getValue(columns[9]);
                    let estado = row.getText(columns[9]);
                    let centro_costo_id_interno = row.getValue(columns[10]);
                    let centro_costo = row.getText(columns[10]);
                    let numero_activo_alternativo = row.getValue(columns[11]);
                    let cantidad_factura = row.getValue(columns[12]);
                    let usuario_depositario_id_interno = row.getValue(columns[13]);
                    let usuario_depositario = row.getText(columns[13]);
                    let estado_proceso_id_interno = row.getValue(columns[14]);
                    let estado_proceso = row.getText(columns[14]);
                    let orden_compra_id_interno = row.getValue(columns[15]);
                    let orden_compra = row.getText(columns[15]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        activo_fijo: { id_interno: activo_fijo_id_interno, id: activo_id, nombre: activo_nombre },
                        factura_compra: { id: factura_compra_id_interno, numero_documento: factura_compra },
                        tipo_activo: { id: tipo_activo_id, nombre: tipo_activo_nombre },
                        descripcion_activo: descripcion_activo,
                        proveedor: proveedor,
                        fecha_compra: fecha_compra,
                        costo_original: costo_original,
                        estado: { id: estado_id_interno, nombre: estado },
                        centro_costo: { id: centro_costo_id_interno, nombre: centro_costo },
                        numero_activo_alternativo: numero_activo_alternativo,
                        cantidad_factura: cantidad_factura,
                        usuario_depositario: { id: usuario_depositario_id_interno, nombre: usuario_depositario },
                        estado_proceso: { id: estado_proceso_id_interno, nombre: estado_proceso },
                        orden_compra: { id: orden_compra_id_interno, numero_documento: orden_compra }
                    });
                });
            });

            // objHelper.error_log('getDataActivosFijos', resultTransaction);
            return resultTransaction;
        }

        function getAssetTypeList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customrecord_ncfar_assettype',
                columns: ['internalid', 'name']
            });

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
        }

        function getClassList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'classification',
                columns: ['internalid', 'name']
            });

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
        }

        function getEstadoProcesoList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_bio_lis_est_proc_con_act',
                columns: ['internalid', 'name']
            });

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
        }

        return { getDataActivosFijos, getAssetTypeList, getClassList, getEstadoProcesoList }

    });
