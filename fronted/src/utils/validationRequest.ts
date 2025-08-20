export type ValidationRules = {
    [key: string]: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        customValidator?: (value: any) => string | null;
    };
};

export type ValidationErrors = {
    [key: string]: string;
};

function formatFieldName(field: string): string {
    const words = field.split("_");
    return words
        .map((word, i) =>
            i === 0
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word.toLowerCase()
        )
        .join(" ");
}

export const validationRequest = (
    formData: Record<string, any>,
    validationRules: ValidationRules
): { isValid: boolean; errors: ValidationErrors } => {
    let errors: ValidationErrors = {};

    Object.keys(validationRules).forEach((field) => {
        const value = formData[field];
        const rules = validationRules[field];
        const displayName = formatFieldName(field);

        if (rules.required && !value) {
            errors[field] = `${displayName} is required`;
        }

        if (rules.minLength && value?.length < rules.minLength) {
            errors[field] = `${displayName} must be at least ${rules.minLength} characters`;
        }

        if (rules.maxLength && value?.length > rules.maxLength) {
            errors[field] = `${displayName} must be at most ${rules.maxLength} characters`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            errors[field] = `${displayName} is invalid`;
        }

        if (rules.customValidator) {
            const customError = rules.customValidator(value);
            if (customError) {
                errors[field] = customError.replace(field, displayName);
            }
        }
    });

    return { isValid: Object.keys(errors).length === 0, errors };
};
