export interface Appointment {
  num_rdv: number;
  date_rdv: Date;
  motif: string;
  id_patient: number;
  patient: any;
}

export interface AppointmentCreateUpdate {
  id_patient: number;
  date_rdv: string;
  motif: string;
}

export interface AppointmentDialogData extends Appointment {
  isEdit?: boolean;
}