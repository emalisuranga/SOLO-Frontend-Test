import * as Yup from "yup";

export const getSalaryValidationSchema = (t) => {
  return Yup.object().shape({
    scheduledWorkingDays: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.scheduledWorkingDays") })
      )
      .required(
        t("validation.required", { field: t("fields.scheduledWorkingDays") })
      ),
    numberOfWorkingDays: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.numberOfWorkingDays") })
      )
      .required(
        t("validation.required", { field: t("fields.numberOfWorkingDays") })
      )
      .min(1, t("validation.greaterThanZero", { field: t("fields.numberOfWorkingDays") })),
    numberOfPaidHolidays: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.numberOfPaidHolidays") })
      )
      .required(
        t("validation.required", { field: t("fields.numberOfPaidHolidays") })
      )
      .test(
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
    numberOfNonPaidLeave: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.numberOfNonPaidLeave") })
      )
      .required(
        t("validation.required", { field: t("fields.numberOfNonPaidLeave") })
      ),
    remainingPaidVacationDays: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.remainingPaidVacationDays") })
      )
      .required(
        t("validation.required", {
          field: t("fields.remainingPaidVacationDays"),
        })
      ),
    // Custom validation for checking the correctness of days off
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
  });
};