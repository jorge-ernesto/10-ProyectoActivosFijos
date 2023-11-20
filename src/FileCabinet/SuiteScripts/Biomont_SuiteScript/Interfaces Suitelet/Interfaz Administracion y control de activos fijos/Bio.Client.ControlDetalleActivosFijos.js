/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

            // Obtener el currentRecord
            let recordContext = scriptContext.currentRecord;

            // Habilitar campos por estado accion
            habilitarCamposPorEstadoAccion(recordContext);
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

            // Obtener el currentRecord
            let recordContext = scriptContext.currentRecord;

            // Esto se ejecuta cuando se hacen cambios en el combo estado accion
            if (scriptContext.fieldId == 'custpage_field_estado_accion') {
                habilitarCamposPorEstadoAccion(recordContext);
            }
        }

        function deshabilitarTodosCampos(recordContext) {

            // SuiteScript 2.x Modules
            // N/currentRecord Module
            // https://6462530.app.netsuite.com/app/help/helpcenter.nl?fid=section_4625600928.html

            // Datos del proveedor
            recordContext.getField('custpage_field_numero_guia').isDisabled = true;

            // Datos del bien
            recordContext.getField('custpage_field_marca').isDisabled = true;
            recordContext.getField('custpage_field_modelo').isDisabled = true;
            recordContext.getField('custpage_field_fecha_activacion').isDisabled = true;
            recordContext.getField('custpage_field_nserie').isDisabled = true;
            recordContext.getField('custpage_field_usuario_depositario').isDisabled = true;
            recordContext.getField('custpage_field_ubicacion').isDisabled = true;
            recordContext.getField('custpage_field_estado_bien').isDisabled = true;
            recordContext.getField('custpage_field_detalle_uso').isDisabled = true;

            // Baja de activo
            recordContext.getField('custpage_field_motivo_Baja').isDisabled = true;
            recordContext.getField('custpage_field_detalle_Baja').isDisabled = true;
            recordContext.getField('custpage_field_archivo_Baja').isDisabled = true;
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_Baja').isDisabled = true;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_Baja').isDisabled = true;

            // Transferencia de activo
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_Transferencia').isDisabled = true;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_Transferencia').isDisabled = true;
            recordContext.getField('custpage_field_nuevaclase_Transferencia').isDisabled = true;
            recordContext.getField('custpage_field_usuariofirma_nuevaclase_Transferencia').isDisabled = true;
            recordContext.getField('custpage_field_fechafirma_nuevaclase_Transferencia').isDisabled = true;
            recordContext.getField('custpage_field_nueva_ubicacion').isDisabled = true;
            recordContext.getField('custpage_field_nuevo_usuario_depositario').isDisabled = true;
        }

        function habilitarCamposAlta(recordContext) {

            let estado_activo = recordContext.getValue('custpage_field_estado_activo');
            let estado_activo_nombre = recordContext.getText('custpage_field_estado_activo');

            // Datos del proveedor
            recordContext.getField('custpage_field_numero_guia').isDisabled = false;

            // Datos del bien
            recordContext.getField('custpage_field_marca').isDisabled = false;
            recordContext.getField('custpage_field_modelo').isDisabled = false;
            if (estado_activo == 6 || estado_activo_nombre == 'Nuevo') recordContext.getField('custpage_field_fecha_activacion').isDisabled = false; // Solo guarda "Fecha de Activación" cuando el "Estado Activo" es "Nuevo"
            recordContext.getField('custpage_field_nserie').isDisabled = false;
            recordContext.getField('custpage_field_usuario_depositario').isDisabled = false;
            recordContext.getField('custpage_field_ubicacion').isDisabled = false;
            recordContext.getField('custpage_field_estado_bien').isDisabled = false;
            recordContext.getField('custpage_field_detalle_uso').isDisabled = false;
        }

        function habilitarCamposBaja(recordContext) {

            // Baja de activo
            recordContext.getField('custpage_field_motivo_Baja').isDisabled = false;
            recordContext.getField('custpage_field_detalle_Baja').isDisabled = false;
            recordContext.getField('custpage_field_archivo_Baja').isDisabled = false;
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_Baja').isDisabled = false;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_Baja').isDisabled = false;
        }

        function habilitarCamposTransferencia(recordContext) {

            // Transferencia de activo
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_Transferencia').isDisabled = false;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_Transferencia').isDisabled = false;
            recordContext.getField('custpage_field_nuevaclase_Transferencia').isDisabled = false;
            recordContext.getField('custpage_field_usuariofirma_nuevaclase_Transferencia').isDisabled = false;
            recordContext.getField('custpage_field_fechafirma_nuevaclase_Transferencia').isDisabled = false;
            recordContext.getField('custpage_field_nueva_ubicacion').isDisabled = false;
            recordContext.getField('custpage_field_nuevo_usuario_depositario').isDisabled = false;
        }

        function habilitarCamposPorEstadoAccion(recordContext) {

            // Ocultar todos los campos
            deshabilitarTodosCampos(recordContext);

            // Obtener combo "Estado Accion"
            let comboEstadoAccion = recordContext.getValue('custpage_field_estado_accion');

            // Obtener field hidden "Estado Accion Id Interno"
            let fieldHiddenEstadoAccionIdInterno = recordContext.getValue('custpage_field_estado_accion_id_interno') || 0;

            // Debug
            console.log('comboEstadoAccion', comboEstadoAccion);
            console.log('fieldHiddenEstadoAccionIdInterno', fieldHiddenEstadoAccionIdInterno)

            /**
            * Funcionalidad para habilitar y deshabilitar campos
            * Estado Acción - Values.
                - Alta: 1
                - Baja: 2
                - Transferencia: 3
            */

            // Si se selecciona combo "Alta"
            if (comboEstadoAccion == 1) {

                // No se hizo una "Alta", "Baja" o "Transferencia" anteriormente
                if (!(fieldHiddenEstadoAccionIdInterno == 1 || fieldHiddenEstadoAccionIdInterno == 2 || fieldHiddenEstadoAccionIdInterno == 3)) {

                    // Habilitar campos "Alta"
                    habilitarCamposAlta(recordContext);
                }
            }

            // Si se selecciona combo "Baja"
            if (comboEstadoAccion == 2) {

                // No se hizo una "Baja" anteriormente
                if (!(fieldHiddenEstadoAccionIdInterno == 2)) {

                    // Habilitar campos "Transferencia"
                    habilitarCamposBaja(recordContext);
                }
            }

            // Si se selecciona combo "Transferencia"
            if (comboEstadoAccion == 3) {

                // No se hizo una "Baja" o "Transferencia"
                if (!(fieldHiddenEstadoAccionIdInterno == 2 || fieldHiddenEstadoAccionIdInterno == 3)) {

                    // Habilitar campos "Transferencia"
                    habilitarCamposTransferencia(recordContext);
                }
            }
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };

    });
