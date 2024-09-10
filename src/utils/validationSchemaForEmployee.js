import * as Yup from "yup";

const getValidationSchema = (t) => {
  return Yup.object().shape({
    employeeNumber: Yup.string()
      .matches(/^[A-Za-z0-9\u3040-\u30FF\u4E00-\u9FFF]+$/, t("validation.alphanumericJapaneseOnly", { field: t("fields.employeeNumber") }))
      .required(t("validation.required", { field: t("fields.employeeNumber") })),
    firstName: Yup.string()
      .matches(
        /^[A-Za-z\s\u3040-\u30FF\u4E00-\u9FFF]+$/,
        t("validation.lettersOnly", { field: t("fields.firstName") })
      )
      .required(t("validation.required", { field: t("fields.firstName") })),
    lastName: Yup.string()
      .matches(
        /^[A-Za-z\s\u3040-\u30FF\u4E00-\u9FFF]+$/,
        t("validation.lettersOnly", { field: t("fields.lastName") })
      )
      .required(t("validation.required", { field: t("fields.lastName") })),
    furiganaFirstName: Yup.string()
      .matches(
        /^[\u30A0-\u30FFー]+$/,
        t("validation.onlyKatakana", { field: t("fields.furiganaFirstName") })
      )
      .required(
        t("validation.required", { field: t("fields.furiganaFirstName") })
      ),
    furiganaLastName: Yup.string()
      .matches(
        /^[\u30A0-\u30FFー]+$/,
        t("validation.onlyKatakana", { field: t("fields.furiganaLastName") })
      )
      .required(
        t("validation.required", { field: t("fields.furiganaLastName") })
      ),
    phone: Yup.string()
      .matches(/^\d{11}$/, t("validation.phoneDigits"))
      .required(t("validation.required", { field: t("fields.phone") })),
    address: Yup.string().required(
      t("validation.required", { field: t("fields.address") })
    ),
    dateOfBirth: Yup.date()
      .required(t("validation.required", { field: t("fields.dateOfBirth") }))
      .typeError(
        t("validation.invalidDate", { field: t("fields.dateOfBirth") })
      ),
    joinDate: Yup.date()
      .required(t("validation.required", { field: t("fields.joinDate") }))
      .typeError(t("validation.invalidDate", { field: t("fields.joinDate") })),
    department: Yup.string().required(
      t("validation.required", { field: t("fields.department") })
    ),
    jobTitle: Yup.string().matches(
      /^[A-Za-z\s\u3040-\u30FF\u4E00-\u9FFF]*$/,
      t("validation.lettersOnly", { field: t("fields.jobTitle") })
    ),
    bankAccountNumber: Yup.number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value
      )
      .notRequired()
      .typeError(
        t("validation.number", { field: t("fields.bankAccountNumber") })
      ),
    bankName: Yup.string()
      .nullable()
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value
      )
      .notRequired()
      .matches(
        /^[A-Za-z\s\u3040-\u30FF\u4E00-\u9FFF]+$/,
        t("validation.lettersOnly", { field: t("fields.bankName") })
      ),
    branchCode: Yup.number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value
      )
      .notRequired()
      .typeError(t("validation.number", { field: t("fields.branchCode") })),
    basicSalary: Yup.number()
      .typeError(t("validation.number", { field: t("fields.basicSalary") }))
      .required(t("validation.required", { field: t("fields.basicSalary") })),
    // overtimePay: Yup.number()
    //   .typeError(t("validation.number", { field: t("fields.overtimePay") }))
    //   .required(t("validation.required", { field: t("fields.overtimePay") })),
    transportationCosts: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.transportationCosts") })
      )
      .required(
        t("validation.required", { field: t("fields.transportationCosts") })
      ),
    familyAllowance: Yup.number()
      .typeError(t("validation.number", { field: t("fields.familyAllowance") }))
      .required(
        t("validation.required", { field: t("fields.familyAllowance") })
      ),
    attendanceAllowance: Yup.number()
      .typeError(
        t("validation.number", { field: t("fields.attendanceAllowance") })
      )
      .required(
        t("validation.required", { field: t("fields.attendanceAllowance") })
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
    spouseDeduction: Yup.number().typeError(
      t("validation.number", { field: t("fields.spouseDeduction") })
    ),
    dependentDeduction: Yup.number().typeError(
      t("validation.number", { field: t("fields.dependentDeduction") })
    ),
  });
};

export default getValidationSchema;
