import * as Yup from "yup";

// Reusable function for number fields with required validation
const requiredNumberField = (t, fieldName) => 
  Yup.number()
    .typeError(t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }))
    .required(t("validation.required", { field: t(`fields.${fieldName}`) }));

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
    overtime: Yup.number()
      .typeError(t("validation.number", { field: t("fields.overtime") }))
      .required(t("validation.required", { field: t("fields.overtime") })),
    timeLate: Yup.number()
      .typeError(t("validation.number", { field: t("fields.timeLate") }))
      .required(t("validation.required", { field: t("fields.timeLate") })),
    timeLeavingEarly: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.timeLeavingEarly") })
      )
      .required(
        t("validation.required", { field: t("fields.timeLeavingEarly") })
      ),
    transportationCosts: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.transportationCosts") })
      )
      .required(
        t("validation.required", { field: t("fields.transportationCosts") })
      ),
    attendanceAllowance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.attendanceAllowance") })
      )
      .required(
        t("validation.required", { field: t("fields.attendanceAllowance") })
      ),
    familyAllowance: Yup.number()
      .typeError(t("validation.number", { field: t("fields.familyAllowance") }))
      .required(
        t("validation.required", { field: t("fields.familyAllowance") })
      ),
    leaveAllowance: Yup.number()
      .typeError(t("validation.number", { field: t("fields.leaveAllowance") }))
      .required(
        t("validation.required", { field: t("fields.leaveAllowance") })
      ),
    specialAllowance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.specialAllowance") })
      )
      .required(
        t("validation.required", { field: t("fields.specialAllowance") })
      ),
    healthInsurance: Yup.number()
      .typeError(t("validation.number", { field: t("fields.healthInsurance") }))
      .required(
        t("validation.required", { field: t("fields.healthInsurance") })
      ),
    employeePensionInsurance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.employeePensionInsurance") })
      )
      .required(
        t("validation.required", {
          field: t("fields.employeePensionInsurance"),
        })
      ),
    employmentInsurance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.employmentInsurance") })
      ),
    longTermCareInsurance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.longTermCareInsurance") })
      )
      .required(
        t("validation.required", { field: t("fields.longTermCareInsurance") })
      ),
    incomeTax: Yup.number()
      .typeError(t("validation.number", { field: t("fields.incomeTax") })),
    residentTax: Yup.number()
      .typeError(t("validation.number", { field: t("fields.residentTax") }))
      .required(t("validation.required", { field: t("fields.residentTax") })),
    advancePayment: Yup.number()
      .typeError(t("validation.number", { field: t("fields.advancePayment") }))
      .required(
        t("validation.required", { field: t("fields.advancePayment") })
      ),
    yearEndAdjustment: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.yearEndAdjustment") })
      )
      .required(
        t("validation.required", { field: t("fields.yearEndAdjustment") })
      ),
    holidayAllowance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.holidayAllowance") })
      )
      .required(
        t("validation.required", { field: t("fields.holidayAllowance") })
      ),
    refundAmount: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.refundAmount") })
      )
      .required(
        t("validation.required", { field: t("fields.refundAmount") })
      ),
    nonEmploymentDeduction: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.nonEmploymentDeduction") })
      )
      .required(
        t("validation.required", { field: t("fields.nonEmploymentDeduction") })
      ),
      overtimePay: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.overtimePay") })
      )
      .required(
        t("validation.required", { field: t("fields.overtimePay") })
      ),
  });
};