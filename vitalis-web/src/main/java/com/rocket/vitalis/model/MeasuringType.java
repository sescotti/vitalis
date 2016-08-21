package com.rocket.vitalis.model;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


/**
 * Created by Ailin on 21/08/2016.
 */
@RequiredArgsConstructor
public enum MeasuringType {

    Temperatura("Temperatura"), PulsoCardíaco("PulsoCardíaco"), RitmoRespiratorio("RitmoRespiratorio"),
    PresionDiastolica("PresionDiastolica"), PresionSistolica("PresionSistolica"), OxigenoEnSangre("OxigenoEnSangre"),
    ConductanciaCutanea("ConductanciaCutanea"), ECG("ECG");



    @NonNull
    String measuringType;

}
