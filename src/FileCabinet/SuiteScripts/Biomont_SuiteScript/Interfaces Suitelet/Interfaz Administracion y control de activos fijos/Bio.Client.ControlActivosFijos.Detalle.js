/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { message } = N.ui;

        const CONFIG_RECORD = {
            baja: {
                fields_mandatory: {
                    subsidiary: {
                        id: 'custpage_field_motivo_baja',
                        label: 'Motivo de baja'
                    },
                    start: {
                        id: 'custpage_field_detalle_baja',
                        label: 'Detalle de baja'
                    },
                    end: {
                        id: 'custpage_field_archivo_baja',
                        label: 'Archivo de baja'
                    }
                }
            },
            transferencia: {
                fields_mandatory: {
                    subsidiary: {
                        id: 'custpage_field_nuevaclase_transferencia',
                        label: 'Nuevo Centro de Costo'
                    },
                    start: {
                        id: 'custpage_field_nueva_ubicacion',
                        label: 'Nueva Ubicación'
                    },
                    end: {
                        id: 'custpage_field_nuevo_usuario_depositario',
                        label: 'Nuevo Usuario (Depositario)'
                    }
                }
            }

        }

        /******************/

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

            // SE EJECUTA SOLO CUANDO SE HACEN CAMBIOS EN EL COMBO ESTADO ACCION
            if (scriptContext.fieldId == 'custpage_field_estado_accion') {
                habilitarCamposPorEstadoAccion(recordContext);
            }
        }

        function habilitarCamposPorEstadoAccion(recordContext) {

            // Deshabilitar todos los campos
            deshabilitarTodosCampos(recordContext);

            /**
            * Funcionalidad para habilitar y deshabilitar campos
            * Estado Acción - Values.
                - Alta: 1
                - Baja: 2
                - Transferencia: 3
            */
            // Obtener combo "Estado Accion" y field hidden "Estado Accion Id Interno"
            let comboEstadoAccion = recordContext.getValue('custpage_field_estado_accion');
            let fieldHiddenEstadoAccionIdInterno = recordContext.getValue('custpage_field_estado_accion_id_interno') || 0;

            // Debug
            console.log('comboEstadoAccion', comboEstadoAccion);
            console.log('fieldHiddenEstadoAccionIdInterno', fieldHiddenEstadoAccionIdInterno);

            // Si es combo "Alta"
            if (comboEstadoAccion == 1) {

                // No se hizo una "Alta", "Baja" o "Transferencia" anteriormente
                if (!(fieldHiddenEstadoAccionIdInterno == 1 || fieldHiddenEstadoAccionIdInterno == 2 || fieldHiddenEstadoAccionIdInterno == 3)) {

                    // Habilitar campos "Alta"
                    habilitarCamposAlta(recordContext);
                }
            }

            // Si es combo "Baja"
            if (comboEstadoAccion == 2) {

                // No se hizo una "Baja" anteriormente
                if (!(fieldHiddenEstadoAccionIdInterno == 2)) {

                    // Habilitar campos "Baja"
                    habilitarCamposBaja(recordContext);
                }
            }

            // Si es combo "Transferencia"
            if (comboEstadoAccion == 3) {

                // No se hizo una "Baja" o "Transferencia"
                if (!(fieldHiddenEstadoAccionIdInterno == 2 || fieldHiddenEstadoAccionIdInterno == 3)) {

                    // Habilitar campos "Transferencia"
                    habilitarCamposTransferencia(recordContext);
                }
            }
        }

        function deshabilitarTodosCampos(recordContext) {

            // Obtener campo y deshabilitarlo
            // https://6462530-sb1.app.netsuite.com/app/help/helpcenter.nl?fid=section_4625600928.html

            // Datos del proveedor
            recordContext.getField('custpage_field_numero_guia').isDisabled = true;

            // Datos del bien
            recordContext.getField('custpage_field_marca').isDisabled = true;
            recordContext.getField('custpage_field_modelo').isDisabled = true;
            recordContext.getField('custpage_field_fecha_uso').isDisabled = true;
            recordContext.getField('custpage_field_fecha_placa').isDisabled = true;
            recordContext.getField('custpage_field_nserie').isDisabled = true;
            recordContext.getField('custpage_field_usuario_depositario').isDisabled = true;
            recordContext.getField('custpage_field_ubicacion').isDisabled = true;
            recordContext.getField('custpage_field_estado_bien').isDisabled = true;
            recordContext.getField('custpage_field_detalle_uso').isDisabled = true;

            // Baja de activo
            recordContext.getField('custpage_field_motivo_baja').isDisabled = true;
            recordContext.getField('custpage_field_detalle_baja').isDisabled = true;
            recordContext.getField('custpage_field_archivo_baja').isDisabled = true;
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_baja').isDisabled = true;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_baja').isDisabled = true;

            // Transferencia de activo
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_transferencia').isDisabled = true;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_transferencia').isDisabled = true;
            recordContext.getField('custpage_field_nuevaclase_transferencia').isDisabled = true;
            recordContext.getField('custpage_field_usuariofirma_nuevaclase_transferencia').isDisabled = true;
            recordContext.getField('custpage_field_fechafirma_nuevaclase_transferencia').isDisabled = true;
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
            recordContext.getField('custpage_field_fecha_uso').isDisabled = false;
            recordContext.getField('custpage_field_fecha_placa').isDisabled = false;
            recordContext.getField('custpage_field_nserie').isDisabled = false;
            recordContext.getField('custpage_field_usuario_depositario').isDisabled = false;
            recordContext.getField('custpage_field_ubicacion').isDisabled = false;
            recordContext.getField('custpage_field_estado_bien').isDisabled = false;
            recordContext.getField('custpage_field_detalle_uso').isDisabled = false;
        }

        function habilitarCamposBaja(recordContext) {

            // Baja de activo
            recordContext.getField('custpage_field_motivo_baja').isDisabled = false;
            recordContext.getField('custpage_field_detalle_baja').isDisabled = false;
            recordContext.getField('custpage_field_archivo_baja').isDisabled = false;
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_baja').isDisabled = false;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_baja').isDisabled = false;
        }

        function habilitarCamposTransferencia(recordContext) {

            // Transferencia de activo
            recordContext.getField('custpage_field_usuariofirma_anteriorclase_transferencia').isDisabled = false;
            recordContext.getField('custpage_field_fechafirma_anteriorclase_transferencia').isDisabled = false;
            recordContext.getField('custpage_field_nuevaclase_transferencia').isDisabled = false;
            recordContext.getField('custpage_field_usuariofirma_nuevaclase_transferencia').isDisabled = false;
            recordContext.getField('custpage_field_fechafirma_nuevaclase_transferencia').isDisabled = false;
            recordContext.getField('custpage_field_nueva_ubicacion').isDisabled = false;
            recordContext.getField('custpage_field_nuevo_usuario_depositario').isDisabled = false;
        }

        function validarComboEstadoAccion(recordContext) {

            // Obtener combo "Estado Accion" y field hidden "Estado Accion"
            let comboEstadoAccion = recordContext.getValue('custpage_field_estado_accion');
            let fieldHiddenEstadoAccion = recordContext.getValue('custpage_field_estado_accion_id_interno') || 0;

            // Obtener label hidden "Estado Accion"
            let labelHiddenEstadoAccion = {
                '1': 'Alta',
                '2': 'Baja',
                '3': 'Transferencia'
            }

            // Debug
            console.log('comboEstadoAccion', comboEstadoAccion);
            console.log('fieldHiddenEstadoAccion', fieldHiddenEstadoAccion);

            // Si es combo "Alta"
            if (comboEstadoAccion == 1) {

                // Se hizo una "Alta", "Baja" o "Transferencia" anteriormente
                if (fieldHiddenEstadoAccion == 1 || fieldHiddenEstadoAccion == 2 || fieldHiddenEstadoAccion == 3) {

                    detenerGuardar(`No se puede guardar. Se realizó la acción de ${labelHiddenEstadoAccion[fieldHiddenEstadoAccion]} anteriormente`);
                    return true;
                }
            }

            // Si es combo "Baja"
            if (comboEstadoAccion == 2) {

                // Se hizo una "Baja" anteriormente
                if (fieldHiddenEstadoAccion == 2) {

                    detenerGuardar(`No se puede guardar. Se realizó la acción de ${labelHiddenEstadoAccion[fieldHiddenEstadoAccion]} anteriormente`);
                    return true;
                }
            }

            // Si es combo "Transferencia"
            if (comboEstadoAccion == 3) {

                // Se hizo una "Baja" o "Transferencia" anteriormente
                if (fieldHiddenEstadoAccion == 2 || fieldHiddenEstadoAccion == 3) {

                    detenerGuardar(`No se puede guardar. Se realizó la acción de ${labelHiddenEstadoAccion[fieldHiddenEstadoAccion]} anteriormente`);
                    return true;
                }
            }

            return false;
        }

        function detenerGuardar(mensajeValidacion) {

            // Mostrar mensaje de validación al usuario
            var messageValidation = message.create({
                title: "Error",
                message: `${mensajeValidacion}`,
                type: message.Type.ERROR
            });
            messageValidation.show({
                duration: 5000 // Duración del mensaje en milisegundos (5 segundos en este ejemplo)
            });
        }

        function validarCamposObligatorios(recordContext) {

            // Declarar variables
            let mensaje = 'Introduzca valores para:';
            let errores = {};

            // Obtener combo "Estado Accion"
            let comboEstadoAccion = recordContext.getValue('custpage_field_estado_accion');

            // BAJA
            if (comboEstadoAccion == 2) {
                for (var key in CONFIG_RECORD.baja.fields_mandatory) {
                    let fieldId = CONFIG_RECORD.baja.fields_mandatory[key]['id'];
                    if (!recordContext.getValue(fieldId)) {
                        errores[CONFIG_RECORD.baja.fields_mandatory[key]['id']] = CONFIG_RECORD.baja.fields_mandatory[key]['label'];
                    };

                    // Validar que archivo termine en ".pdf", ".xls" o ".xlsx"
                    if (fieldId == 'custpage_field_archivo_baja') {
                        if (!esArchivoExtensionPermitida(recordContext, fieldId)) {
                            errores[CONFIG_RECORD.baja.fields_mandatory[key]['id']] = CONFIG_RECORD.baja.fields_mandatory[key]['label'] + ' (El archivo debe tener extensión ".pdf", ".xls" o ".xlsx")';
                        }
                    }
                }
            }

            // TRANSFERENCIA
            if (comboEstadoAccion == 3) {
                for (var key in CONFIG_RECORD.transferencia.fields_mandatory) {
                    let fieldId = CONFIG_RECORD.transferencia.fields_mandatory[key]['id'];
                    if (!recordContext.getValue(fieldId)) {
                        errores[CONFIG_RECORD.transferencia.fields_mandatory[key]['id']] = CONFIG_RECORD.transferencia.fields_mandatory[key]['label'];
                    };
                }
            }

            if (Object.keys(errores).length > 0) {
                for (let error in errores) {
                    mensaje += ` ${errores[error]},`
                }
                mensaje = mensaje.substring(0, mensaje.length - 1);
                alert(mensaje);
                return true;
            }

            return false;
        }

        function esArchivoExtensionPermitida(recordContext, fieldId) {

            // Obtener datos del archivo
            let nombre_archivo = recordContext.getValue(fieldId);

            // Validar que archivo termine en ".pdf", ".xls" o ".xlsx"
            if ([".pdf", ".xls", ".xlsx"].some(extension => nombre_archivo.toLowerCase().endsWith(extension))) {
                return true;
            }
            return false;
        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

            // Obtener el currentRecord
            let recordContext = scriptContext.currentRecord;

            /****************** Validar combo "Estado Accion" ******************/
            // Validar combo "Estado Accion"
            if (validarComboEstadoAccion(recordContext)) {
                return false;
            }

            /****************** Validar campos obligatorios ******************/
            // Validar campos obligatorios
            if (validarCamposObligatorios(recordContext)) {
                return false;
            }

            return true;
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };

    });
