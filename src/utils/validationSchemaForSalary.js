import * as Yup from "yup";

// Reusable function for number fields with required validation
const requiredNumberField = (t, fieldName) => 
  Yup.number()
    .typeError(t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }))
    .required(t("validation.required", { field: t(`fields.${fieldName}`) }));

// Reusable function for number fields with no required validation
const numberField = (t, fieldName) => 
  Yup.number()
    .typeError(t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }));

// Reusable function for number fields with minimum value validation
const requiredNumberWithMinField = (t, fieldName, minValue = 1) => 
  Yup.number()
    .typeError(t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }))
    .required(t("validation.required", { field: t(`fields.${fieldName}`) }))
    .min(minValue, t("validation.greaterThanZero", { field: t(`fields.${fieldName}`) }));

export const getSalaryValidationSchema = (t) => {
  return Yup.object().shape({
    scheduledWorkingDays: requiredNumberField(t, "scheduledWorkingDays"),
    numberOfWorkingDays: requiredNumberWithMinField(t, "numberOfWorkingDays"),
    numberOfPaidHolidays: requiredNumberField(t, "numberOfPaidHolidays").test(
      "less-than-remaining",
      t("validation.lessThanRemainingVacationDays", {
        numberOfPaidHolidays: t("fields.numberOfPaidHolidays"),
        remainingPaidVacationDays: t("fields.remainingPaidVacationDays"),
      }),
      function (value) {
        const { remainingPaidVacationDays } = this.parent;
        return value <= remainingPaidVacationDays;
      }
    ),
    numberOfNonPaidLeave: requiredNumberField(t, "numberOfNonPaidLeave"),
    remainingPaidVacationDays: requiredNumberField(t, "remainingPaidVacationDays"),
    daysOffCheck: Yup.mixed().test(
      "check-days-off",
      t("validation.daysOffMismatch"),
      function () {
        const { scheduledWorkingDays, numberOfWorkingDays, numberOfPaidHolidays = 0, numberOfNonPaidLeave = 0 } = this.parent;

        const checkCorrectDayOff = Math.max(scheduledWorkingDays - numberOfWorkingDays, 0);
        const currantDayOff = numberOfNonPaidLeave + numberOfPaidHolidays;

        return checkCorrectDayOff === currantDayOff;
      }
    ),
    overtime: requiredNumberField(t, "overtime"),
    timeLate: requiredNumberField(t, "timeLate"),
    timeLeavingEarly: requiredNumberField(t, "timeLeavingEarly"),
    transportationCosts: requiredNumberField(t, "transportationCosts"),
    attendanceAllowance: requiredNumberField(t, "attendanceAllowance"),
    familyAllowance: requiredNumberField(t, "familyAllowance"),
    leaveAllowance: requiredNumberField(t, "leaveAllowance"),
    specialAllowance: requiredNumberField(t, "specialAllowance"),
    healthInsurance: requiredNumberField(t, "healthInsurance"),
    employeePensionInsurance: requiredNumberField(t, "employeePensionInsurance"),
    employmentInsurance: numberField(t, "employmentInsurance"),
    longTermCareInsurance: requiredNumberField(t, "longTermCareInsurance"),
    incomeTax: numberField(t, "incomeTax"),
    residentTax: requiredNumberField(t, "residentTax"),
    advancePayment: requiredNumberField(t, "advancePayment"),
    yearEndAdjustment: requiredNumberField(t, "yearEndAdjustment"),
    holidayAllowance: requiredNumberField(t, "holidayAllowance"),
    refundAmount: requiredNumberField(t, "refundAmount"),
    nonEmploymentDeduction: requiredNumberField(t, "nonEmploymentDeduction"),
  });
};