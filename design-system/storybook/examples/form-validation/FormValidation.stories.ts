import { html } from 'lit';

import type { TsCheckbox } from '@tuvsud/design-system/checkbox';
import type { TsDatePicker } from '@tuvsud/design-system/date-picker';
import type { TsDateRange } from '@tuvsud/design-system/date-range';
import type { TsInput } from '@tuvsud/design-system/input';
import type { TsRadioGroup } from '@tuvsud/design-system/radio-group';
import type { TsRange } from '@tuvsud/design-system/range';
import type { TsSelect } from '@tuvsud/design-system/select';
import type { TsTextarea } from '@tuvsud/design-system/textarea';

import type { Meta, StoryObj } from '@storybook/web-components';

import '@tuvsud/design-system/input';
import '@tuvsud/design-system/textarea';
import '@tuvsud/design-system/select';
import '@tuvsud/design-system/option';
import '@tuvsud/design-system/checkbox';
import '@tuvsud/design-system/radio-group';
import '@tuvsud/design-system/radio';
import '@tuvsud/design-system/range';
import '@tuvsud/design-system/date-picker';
import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

const meta = {
    title: 'Examples/Form Validation/Examples',
    parameters: {
        docs: {
            description: {
                component: `Interactive form validation examples demonstrating various validation patterns using the Design System components.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Basic form validation example with required fields.
 * Submit the form to see validation errors.
 */
export const BasicValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A simple form with required field validation. All fields must be filled before submission.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;

                const name = form.querySelector('ts-input[name="name"]') as TsInput;
                const email = form.querySelector('ts-input[name="email"]') as TsInput;

                let isValid = true;

                // Reset errors
                name.error = false;
                name.errorMessage = '';
                email.error = false;
                email.errorMessage = '';

                // Validate name
                if (!name.value || name.value.trim() === '') {
                    name.error = true;
                    name.errorMessage = 'Name is required.';
                    isValid = false;
                }

                // Validate email
                if (!email.value || email.value.trim() === '') {
                    email.error = true;
                    email.errorMessage = 'Email is required.';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                    email.error = true;
                    email.errorMessage = 'Please enter a valid email address.';
                    isValid = false;
                }

                if (isValid) {
                    alert('Form submitted successfully!');
                }
            }}
            style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;"
        >
            <ts-input name="name" label="Full Name" help-text="Enter your full name" required></ts-input>

            <ts-input
                name="email"
                type="email"
                label="Email Address"
                help-text="Enter your email address"
                required
                autocomplete="email"
            ></ts-input>

            <ts-button type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};

/**
 * Form with various input types and validation rules.
 */
export const CompleteFormValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A comprehensive form example with multiple field types including text inputs, textarea, select, checkbox, radio group, and range slider.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;

                const firstName = form.querySelector('ts-input[name="firstName"]') as TsInput;
                const lastName = form.querySelector('ts-input[name="lastName"]') as TsInput;
                const email = form.querySelector('ts-input[name="email"]') as TsInput;
                const phone = form.querySelector('ts-input[name="phone"]') as TsInput;
                const country = form.querySelector('ts-select[name="country"]') as TsSelect;
                const bio = form.querySelector('ts-textarea[name="bio"]') as TsTextarea;
                const experience = form.querySelector('ts-range[name="experience"]') as TsRange;
                const terms = form.querySelector('ts-checkbox[name="terms"]') as TsCheckbox;
                const contactMethod = form.querySelector('ts-radio-group[name="contactMethod"]') as TsRadioGroup;

                let isValid = true;

                // Reset all errors
                [firstName, lastName, email, phone].forEach(field => {
                    field.error = false;
                    field.errorMessage = '';
                });
                country.error = false;
                country.errorMessage = '';
                bio.error = false;
                bio.errorMessage = '';
                experience.error = false;
                experience.errorMessage = '';
                terms.error = false;
                terms.errorMessage = '';
                contactMethod.error = false;
                contactMethod.errorMessage = '';

                // Validate first name
                if (!firstName.value?.trim()) {
                    firstName.error = true;
                    firstName.errorMessage = 'First name is required.';
                    isValid = false;
                }

                // Validate last name
                if (!lastName.value?.trim()) {
                    lastName.error = true;
                    lastName.errorMessage = 'Last name is required.';
                    isValid = false;
                }

                // Validate email
                if (!email.value?.trim()) {
                    email.error = true;
                    email.errorMessage = 'Email is required.';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                    email.error = true;
                    email.errorMessage = 'Please enter a valid email address.';
                    isValid = false;
                }

                // Validate phone (optional but must be valid if provided)
                if (phone.value && !/^\+?[\d\s-]{10,}$/.test(phone.value)) {
                    phone.error = true;
                    phone.errorMessage = 'Please enter a valid phone number.';
                    isValid = false;
                }

                // Validate country
                if (!country.value) {
                    country.error = true;
                    country.errorMessage = 'Please select a country.';
                    isValid = false;
                }

                // Validate bio (minimum 20 characters)
                if (!bio.value?.trim()) {
                    bio.error = true;
                    bio.errorMessage = 'Bio is required.';
                    isValid = false;
                } else if (bio.value.trim().length < 20) {
                    bio.error = true;
                    bio.errorMessage = 'Bio must be at least 20 characters.';
                    isValid = false;
                }

                // Validate experience (must be at least 1 year)
                if (experience.value < 1) {
                    experience.error = true;
                    experience.errorMessage = 'At least 1 year of experience is required.';
                    isValid = false;
                }

                // Validate contact method
                if (!contactMethod.value) {
                    contactMethod.error = true;
                    contactMethod.errorMessage = 'Please select a contact method.';
                    isValid = false;
                }

                // Validate terms checkbox
                if (!terms.checked) {
                    terms.error = true;
                    terms.errorMessage = 'You must accept the terms and conditions.';
                    isValid = false;
                }

                if (isValid) {
                    alert('Form submitted successfully!');
                }
            }}
            style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px;"
        >
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <ts-input name="firstName" label="First Name" required></ts-input>

                <ts-input name="lastName" label="Last Name" required></ts-input>
            </div>

            <ts-input name="email" type="email" label="Email Address" required>
                <ts-tooltip
                    content="We'll use this address to send order confirmations and never share it."
                    slot="label-icon"
                    role="button"
                    tabindex="0"
                    aria-label="More information about the email address field"
                >
                    <ts-icon name="info" library="system" size="16" aria-hidden="true"></ts-icon>
                </ts-tooltip>
            </ts-input>

            <ts-input name="phone" type="tel" label="Phone Number" help-text="Optional">
                <ts-tooltip
                    content="Include the country code, e.g. +49 30 1234567. Used only for delivery questions."
                    slot="label-icon"
                >
                    <ts-icon name="info" library="system" size="16" aria-hidden="true"></ts-icon>
                </ts-tooltip>
            </ts-input>

            <ts-select name="country" label="Country" placeholder="Select a country" required>
                <ts-option value="de">Germany</ts-option>
                <ts-option value="us">United States</ts-option>
                <ts-option value="uk">United Kingdom</ts-option>
                <ts-option value="fr">France</ts-option>
                <ts-option value="es">Spain</ts-option>
            </ts-select>

            <ts-textarea
                name="bio"
                label="Bio"
                help-text="Tell us about yourself (minimum 20 characters)"
                rows="4"
                required
            ></ts-textarea>

            <ts-range
                name="experience"
                label="Years of Experience"
                min="0"
                max="20"
                value="0"
                help-text="Select your years of experience"
            ></ts-range>

            <ts-radio-group name="contactMethod" label="Preferred Contact Method">
                <ts-radio value="email">Email</ts-radio>
                <ts-radio value="phone">Phone</ts-radio>
                <ts-radio value="mail">Mail</ts-radio>
            </ts-radio-group>

            <ts-checkbox name="terms"> I accept the terms and conditions </ts-checkbox>

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <ts-button type="submit" variant="primary">Submit</ts-button>
                <ts-button type="reset" variant="default">Reset</ts-button>
            </div>
        </form>
    `,
};

/**
 * Real-time validation as user types.
 */
export const RealTimeValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This example demonstrates real-time validation feedback as the user types, providing immediate feedback on input validity.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
            }}
            style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;"
        >
            <ts-input
                name="username"
                label="Username"
                help-text="3-20 characters, letters and numbers only"
                @ts-input=${(e: CustomEvent) => {
                    const input = e.target as TsInput;
                    const value = input.value || '';

                    if (value.length === 0) {
                        input.error = false;
                        input.errorMessage = '';
                    } else if (value.length < 3) {
                        input.error = true;
                        input.errorMessage = 'Username must be at least 3 characters.';
                    } else if (value.length > 20) {
                        input.error = true;
                        input.errorMessage = 'Username must not exceed 20 characters.';
                    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                        input.error = true;
                        input.errorMessage = 'Username can only contain letters and numbers.';
                    } else {
                        input.error = false;
                        input.errorMessage = '';
                    }
                }}
            ></ts-input>

            <ts-input
                name="password"
                type="password"
                label="Password"
                password-toggle
                help-text="Minimum 8 characters with at least one number"
                @ts-input=${(e: CustomEvent) => {
                    const input = e.target as TsInput;
                    const value = input.value || '';

                    if (value.length === 0) {
                        input.error = false;
                        input.errorMessage = '';
                    } else if (value.length < 8) {
                        input.error = true;
                        input.errorMessage = 'Password must be at least 8 characters.';
                    } else if (!/\d/.test(value)) {
                        input.error = true;
                        input.errorMessage = 'Password must contain at least one number.';
                    } else {
                        input.error = false;
                        input.errorMessage = '';
                    }
                }}
            ></ts-input>

            <ts-input
                name="email"
                type="email"
                label="Email"
                @ts-blur=${(e: CustomEvent) => {
                    const input = e.target as TsInput;
                    const value = input.value || '';

                    if (value.length === 0) {
                        input.error = false;
                        input.errorMessage = '';
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        input.error = true;
                        input.errorMessage = 'Please enter a valid email address.';
                    } else {
                        input.error = false;
                        input.errorMessage = '';
                    }
                }}
            ></ts-input>

            <ts-button type="submit" variant="primary">Create Account</ts-button>
        </form>
    `,
};

/**
 * Password confirmation validation.
 */
export const PasswordConfirmation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Example showing password and confirm password validation to ensure both fields match.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;

                const password = form.querySelector('ts-input[name="password"]') as TsInput;
                const confirmPassword = form.querySelector('ts-input[name="confirmPassword"]') as TsInput;

                let isValid = true;

                password.error = false;
                password.errorMessage = '';
                confirmPassword.error = false;
                confirmPassword.errorMessage = '';

                if (!password.value || password.value.length < 8) {
                    password.error = true;
                    password.errorMessage = 'Password must be at least 8 characters.';
                    isValid = false;
                }

                if (!confirmPassword.value) {
                    confirmPassword.error = true;
                    confirmPassword.errorMessage = 'Please confirm your password.';
                    isValid = false;
                } else if (password.value !== confirmPassword.value) {
                    confirmPassword.error = true;
                    confirmPassword.errorMessage = 'Passwords do not match.';
                    isValid = false;
                }

                if (isValid) {
                    alert('Password changed successfully!');
                }
            }}
            style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;"
        >
            <ts-input
                name="password"
                type="password"
                label="New Password"
                password-toggle
                help-text="Minimum 8 characters"
                required
            ></ts-input>

            <ts-input
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                password-toggle
                help-text="Re-enter your password"
                required
            ></ts-input>

            <ts-button type="submit" variant="primary">Change Password</ts-button>
        </form>
    `,
};

/**
 * Date picker validation with custom rules.
 */
export const DatePickerValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Example showing date picker validation with custom business rules like date range restrictions and weekday validation.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;

                const appointmentDate = form.querySelector('ts-date-picker[name="appointment"]') as TsDatePicker;
                const eventDate = form.querySelector('ts-date-picker[name="eventDate"]') as TsDatePicker;

                let isValid = true;

                // Reset errors
                appointmentDate.dateError = false;
                appointmentDate.dateErrorMessage = '';
                eventDate.dateError = false;
                eventDate.dateErrorMessage = '';

                // Validate appointment date (required and future date)
                if (!appointmentDate.value) {
                    appointmentDate.dateError = true;
                    appointmentDate.dateErrorMessage = 'Appointment date is required.';
                    isValid = false;
                } else {
                    const selectedDate = new Date(appointmentDate.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        appointmentDate.dateError = true;
                        appointmentDate.dateErrorMessage = 'Appointment date must be in the future.';
                        isValid = false;
                    } else {
                        // Check if it's a weekend
                        const dayOfWeek = selectedDate.getDay();
                        if (dayOfWeek === 0 || dayOfWeek === 6) {
                            appointmentDate.dateError = true;
                            appointmentDate.dateErrorMessage = 'Appointments are only available on weekdays.';
                            isValid = false;
                        }
                    }
                }

                // Validate event date (required and within next 90 days)
                if (!eventDate.value) {
                    eventDate.dateError = true;
                    eventDate.dateErrorMessage = 'Event date is required.';
                    isValid = false;
                } else {
                    const selectedDate = new Date(eventDate.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const ninetyDaysFromNow = new Date(today);
                    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

                    if (selectedDate < today) {
                        eventDate.dateError = true;
                        eventDate.dateErrorMessage = 'Event date must be in the future.';
                        isValid = false;
                    } else if (selectedDate > ninetyDaysFromNow) {
                        eventDate.dateError = true;
                        eventDate.dateErrorMessage = 'Event date must be within the next 90 days.';
                        isValid = false;
                    }
                }

                if (isValid) {
                    alert('Dates validated successfully!');
                }
            }}
            style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;"
        >
            <ts-date-picker
                name="appointment"
                label="Appointment Date"
                help-text="Select a future weekday"
                required
                @ts-date-change=${(e: CustomEvent) => {
                    const datePicker = e.target as TsDatePicker;
                    const value = datePicker.value;

                    if (value) {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (selectedDate < today) {
                            datePicker.dateError = true;
                            datePicker.dateErrorMessage = 'Appointment date must be in the future.';
                        } else {
                            const dayOfWeek = selectedDate.getDay();
                            if (dayOfWeek === 0 || dayOfWeek === 6) {
                                datePicker.dateError = true;
                                datePicker.dateErrorMessage = 'Appointments are only available on weekdays.';
                            } else {
                                datePicker.dateError = false;
                                datePicker.dateErrorMessage = '';
                            }
                        }
                    }
                }}
            ></ts-date-picker>

            <ts-date-picker
                name="eventDate"
                label="Event Date"
                help-text="Must be within the next 90 days"
                required
                @ts-date-change=${(e: CustomEvent) => {
                    const datePicker = e.target as TsDatePicker;
                    const value = datePicker.value;

                    if (value) {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const ninetyDaysFromNow = new Date(today);
                        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

                        if (selectedDate < today) {
                            datePicker.dateError = true;
                            datePicker.dateErrorMessage = 'Event date must be in the future.';
                        } else if (selectedDate > ninetyDaysFromNow) {
                            datePicker.dateError = true;
                            datePicker.dateErrorMessage = 'Event date must be within the next 90 days.';
                        } else {
                            datePicker.dateError = false;
                            datePicker.dateErrorMessage = '';
                        }
                    }
                }}
            ></ts-date-picker>

            <ts-button type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};

/**
 * Date range validation with custom rules.
 */
export const DateRangeValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Example showing date range validation with custom business rules like minimum/maximum range duration and date restrictions.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;

                const vacationRange = form.querySelector('ts-date-range[name="vacation"]') as TsDateRange;
                const projectRange = form.querySelector('ts-date-range[name="project"]') as TsDateRange;

                let isValid = true;

                // Reset errors
                vacationRange.errorStart = false;
                vacationRange.errorMessageStart = '';
                vacationRange.errorEnd = false;
                vacationRange.errorMessageEnd = '';
                projectRange.errorStart = false;
                projectRange.errorMessageStart = '';
                projectRange.errorEnd = false;
                projectRange.errorMessageEnd = '';

                // Validate vacation range (required, minimum 7 days, maximum 30 days)
                if (!vacationRange.valueStart || !vacationRange.valueEnd) {
                    if (!vacationRange.valueStart) {
                        vacationRange.errorStart = true;
                        vacationRange.errorMessageStart = 'Start date is required.';
                    }
                    if (!vacationRange.valueEnd) {
                        vacationRange.errorEnd = true;
                        vacationRange.errorMessageEnd = 'End date is required.';
                    }
                    isValid = false;
                } else {
                    const startDate = new Date(vacationRange.valueStart);
                    const endDate = new Date(vacationRange.valueEnd);
                    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysDiff < 7) {
                        vacationRange.errorEnd = true;
                        vacationRange.errorMessageEnd = 'Vacation must be at least 7 days.';
                        isValid = false;
                    } else if (daysDiff > 30) {
                        vacationRange.errorEnd = true;
                        vacationRange.errorMessageEnd = 'Vacation cannot exceed 30 days.';
                        isValid = false;
                    }
                }

                // Validate project range (required, maximum 90 days)
                if (!projectRange.valueStart || !projectRange.valueEnd) {
                    if (!projectRange.valueStart) {
                        projectRange.errorStart = true;
                        projectRange.errorMessageStart = 'Project start date is required.';
                    }
                    if (!projectRange.valueEnd) {
                        projectRange.errorEnd = true;
                        projectRange.errorMessageEnd = 'Project end date is required.';
                    }
                    isValid = false;
                } else {
                    const startDate = new Date(projectRange.valueStart);
                    const endDate = new Date(projectRange.valueEnd);
                    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysDiff > 90) {
                        projectRange.errorEnd = true;
                        projectRange.errorMessageEnd = 'Project duration cannot exceed 90 days.';
                        isValid = false;
                    }

                    // Check if start date is in the past
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (startDate < today) {
                        projectRange.errorStart = true;
                        projectRange.errorMessageStart = 'Project start date cannot be in the past.';
                        isValid = false;
                    }
                }

                if (isValid) {
                    alert('Date ranges validated successfully!');
                }
            }}
            style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px;"
        >
            <ts-date-range
                name="vacation"
                label-start="Vacation Start"
                label-end="Vacation End"
                help-text="Minimum 7 days, maximum 30 days"
                required
                @ts-date-change=${(e: CustomEvent) => {
                    const dateRange = e.target as TsDateRange;
                    const { start, end } = e.detail;

                    // Reset errors
                    dateRange.errorStart = false;
                    dateRange.errorMessageStart = '';
                    dateRange.errorEnd = false;
                    dateRange.errorMessageEnd = '';

                    if (start && end) {
                        const startDate = new Date(start);
                        const endDate = new Date(end);
                        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                        if (daysDiff < 7) {
                            dateRange.errorEnd = true;
                            dateRange.errorMessageEnd = 'Vacation must be at least 7 days.';
                        } else if (daysDiff > 30) {
                            dateRange.errorEnd = true;
                            dateRange.errorMessageEnd = 'Vacation cannot exceed 30 days.';
                        }
                    }
                }}
            ></ts-date-range>

            <ts-date-range
                name="project"
                label-start="Project Start"
                label-end="Project End"
                help-text="Maximum 90 days, start date must be in the future"
                required
                @ts-date-change=${(e: CustomEvent) => {
                    const dateRange = e.target as TsDateRange;
                    const { start, end } = e.detail;

                    // Reset errors
                    dateRange.errorStart = false;
                    dateRange.errorMessageStart = '';
                    dateRange.errorEnd = false;
                    dateRange.errorMessageEnd = '';

                    if (start && end) {
                        const startDate = new Date(start);
                        const endDate = new Date(end);
                        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (startDate < today) {
                            dateRange.errorStart = true;
                            dateRange.errorMessageStart = 'Project start date cannot be in the past.';
                        } else if (daysDiff > 90) {
                            dateRange.errorEnd = true;
                            dateRange.errorMessageEnd = 'Project duration cannot exceed 90 days.';
                        }
                    }
                }}
            ></ts-date-range>

            <ts-button type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};
