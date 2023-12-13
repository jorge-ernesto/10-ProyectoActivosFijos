/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, search } = N;

        function getDataActivosFijos(subsidiary) {

            // Declarar variables
            let resultTransaction = [];

            // Filtro de subsidiary
            let array_where_subsidiary = ["custrecord_assetsubsidiary", "anyof", "@NONE@"];
            if (subsidiary != '') {
                array_where_subsidiary = ["custrecord_assetsubsidiary", "anyof", subsidiary];
            }

            // Declarar search
            let searchObject = {
                type: 'customrecord_ncfar_asset',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.DESC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "custrecord_assetstatus", label: "Estado de activo" }),
                    search.createColumn({ name: "custrecord_assetsourcetrn", label: "Transacción principal" }),
                    search.createColumn({ name: "custrecord_bio_proc_obt_can_act_fij", label: "Proceso (Obtener cantidades de activos)" }),
                    search.createColumn({ name: "custrecord_assetclass", label: "Clase" })
                ],
                filters: [
                    ["custrecord_assetstatus", "anyof", "6"],
                    "AND",
                    array_where_subsidiary
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataActivosFijos');
            // objHelper.error_log('', count);

            // Recorrer search
            searchContext.run().each(node => {
                // Obtener informacion
                let columns = node.columns;
                let activo_fijo_id_interno = node.getValue(columns[0]);
                let estado_id_interno = node.getValue(columns[1]);
                let estado = node.getText(columns[1]);
                let factura_compra_id_interno = node.getValue(columns[2]);
                let factura_compra = node.getText(columns[2]);
                let proceso_actualizar = node.getValue(columns[3]);
                let centro_costo_id_interno = node.getValue(columns[4]);
                let centro_costo = node.getText(columns[4]);

                // Insertar informacion en array
                resultTransaction.push({
                    activo_fijo: { id: activo_fijo_id_interno },
                    estado: { id: estado_id_interno, nombre: estado },
                    factura_compra: { id: factura_compra_id_interno, numero_documento: factura_compra },
                    proceso_actualizar: proceso_actualizar,
                    centro_costo: { id: centro_costo_id_interno, nombre: centro_costo }
                });
                return true;
            })

            // objHelper.error_log('getDataActivosFijos', resultTransaction);
            return resultTransaction;
        }

        function getDataFacturasCompras(dataActivosFijos) {

            // Declarar variables
            let resultTransaction = [];

            // Filtro de Facturas de Compras
            let data_item_id_interno = getFilterFacturasCompras(dataActivosFijos);
            let array_where_factura_compra = ["internalid", "anyof", "@NONE@"];
            if (Object.keys(dataActivosFijos).length > 0) {
                array_where_factura_compra = ["internalid", "anyof"].concat(data_item_id_interno);
            }
            objHelper.error_log('array_where_factura_compra', array_where_factura_compra);

            // Declarar search
            let searchObject = {
                type: 'vendorbill',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.DESC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "tranid", label: "Nro Doc" }),
                    search.createColumn({ name: "class", label: "Centro de Costo" }),
                    search.createColumn({ name: "quantity", label: "Cantidad" })
                ],
                filters: [
                    ["mainline", "is", "F"],
                    "AND",
                    ["taxline", "is", "F"],
                    "AND",
                    ["type", "anyof", "VendBill"],
                    "AND",
                    ["class.name", "isnotempty", ""],
                    "AND",
                    ["quantity", "lessthan", "1"],
                    "AND",
                    array_where_factura_compra
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataFacturasCompras');
            // objHelper.error_log('', count);

            // Recorrer search
            searchContext.run().each(node => {
                // Obtener informacion
                let columns = node.columns;
                let factura_compra_id_interno = node.getValue(columns[0]);
                let factura_compra = node.getValue(columns[1]);
                let centro_costo_id_interno = node.getValue(columns[2]);
                let centro_costo = node.getText(columns[2]);
                let cantidad = node.getValue(columns[3]);

                // Insertar informacion en array
                resultTransaction.push({
                    factura_compra: { id: factura_compra_id_interno, numero_documento: factura_compra },
                    centro_costo: { id: centro_costo_id_interno, nombre: centro_costo },
                    cantidad: cantidad,
                });
                return true; // La funcion each debes indicarle si quieres que siga iterando o no
            })

            // objHelper.error_log('getDataFacturasCompras', resultTransaction);
            return resultTransaction;
        }

        function getFilterFacturasCompras(dataActivosFijos) {

            // Obtener Facturas de Compras
            let data_factura_compra_id_interno = [];
            dataActivosFijos.forEach(element => {
                data_factura_compra_id_interno.push(element.factura_compra.id)
            });
            // objHelper.error_log('data_factura_compra_id_interno', data_factura_compra_id_interno);

            // Filtrar Facturas de Compras duplicados
            // Referencia: https://matiashernandez.dev/blog/post/4-formas-de-eliminar-elementos-duplicados-en-un-arreglo-con-javascript
            let data_filter_factura_compra_id_interno = [];
            const dataArr = new Set(data_factura_compra_id_interno);
            data_filter_factura_compra_id_interno = [...dataArr];
            // objHelper.error_log('data_filter_factura_compra_id_interno', data_filter_factura_compra_id_interno);

            return data_filter_factura_compra_id_interno;
        }

        return { getDataActivosFijos, getDataFacturasCompras }

    });
