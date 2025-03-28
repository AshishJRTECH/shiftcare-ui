export const baseUrl = process.env.NEXT_APP_BASE_URL;
export const baseUrlApi = `${process.env.NEXT_APP_BASE_URL}/api`;
export const baseUrlMedia = process.env.NEXT_APP_BASE_URL;

// api doc => https://militarymoves-admin.dedicateddevelopers.us/apidoc

export const mediaUrl = (url: string) => {
  return `${baseUrlMedia}/uploads/${url}`;
};

export const endpoints = {
  auth: {
    signup: "/auth/register",
    login: "/auth/signin",
    set_password: "/auth/set-password",
    forgot_password: "/auth/forgot-password",
    reset_password: "/auth/reset-password",
    change_password: "/auth/change-password",
    last_signin: (id: string) => `/auth/${id}/last-signin`,
    resend_invite: "/auth/verification-link"
  },
  cms: {
    about: "/aboutpolicy/details",
    faq: "/faq/all"
  },
  staff: {
    get_all_shifts: "/shift/getAllActiveShift/ForACarer",
    new: "/user/add",
    list: "/user/employees/by-company/active",
    getStaff: "/user",
    update_profile_photo: "/user/photo",
    get_staff_settings: "/employeeSettings/employees",
    staff_compliance: (id: string) =>
      `/document/employees/${id}/documents/by-category/3`,
    staff_all_documents: (id: string) =>
      `/document/employees/${id}/documents/by-category/new`,
    delete_staff: "/user/soft",
    get_note: "/user/get-notes",
    update_notes: (id: string) => `/user/${id}/notes`,
    update_staff: "/user/editEmployee",
    update_settings: "/employeeSettings/employees",
    get_archieved_staffs: "/user/employees/by-company/soft-deleted",
    unarchive_staff: "/user/unarchived",
    get_all_documents: "/document/all",
    upload_documents: "/document/upload",
    edit_document: "/document/updateDocument",
    delete_document: "/document",
    timesheet: "/timesheets/forEmployee",
    get_category: "/document-categories/all",
    get_sub_category: "/document-subcategories/all",
    create_compliance: (employeeId: string, subcategoryId: string) =>
      `/document/uploaded-documents/${employeeId}/${subcategoryId}`,
    update_compliance: (
      employeeId: string,
      subcategoryId: string,
      documentId: string
    ) =>
      `/document/uploaded-documents/${employeeId}/${subcategoryId}/${documentId}`,
    // time_sheet: (id: number) => `/timesheets/${id}`
    // timesheets: "/timesheets/employee"
    // gettimesheet: "/timesheets/employee",
    // time_sheet: (id: string) => `/timesheets/${id}`
    approve_timesheet: (id: string) => `/timesheets/${id}/approve`,
    approve_all_timesheet: (employeeId: string) =>
      `/timesheets/employee/${employeeId}/approveAllTimesheet`,
    undo_timesheet: (timesheetId: string) =>
      `/timesheets/${timesheetId}/undoApprove`,
    undo_all_timesheet: (employeeId: string) =>
      `/timesheets/employee/${employeeId}/undoAllApprovedTimesheet`,
    get_staff_report: (categoryName: string) =>
      `/document/employee-documents/getReport/withExpiry/${categoryName}`,
    get_client_shift_list: (employeeID: string) =>
      `/shift/employee/${employeeID}/locations/new`,
    create_document_subcategory: (categoryId: string) =>
      `/document-subcategories/${categoryId}`,
    get_all_shifts_job_pickup:
      "/shift/getAllActiveShiftAvailableForPickup/ForACarer",
    get_payroll_setting: (id: string) => `/payroll/forEmployee/${id}`,
    update_payroll_setting: (id: string) =>
      `/payroll/payrollSettings/${id}/update`
  },
  client: {
    // get_all: "/client/by-company/active",
    get_all_temorary_client: "/client/by-company/active/temp",
    get_all: "/client/by-company/Limited/active",
    get_archieved_clients: "/client/by-company/inactive",
    add_client: "/client/add",
    delete_client: "/client/softDelete",
    unarchive_client: "/client/unarchived",
    get_client: (id: string) => `/client/${id}`,
    get_client_settngs: (id: string) => `/clientSettings/client/${id}`,

    get_client_documents: (id: string) => `/document/client/${id}`,
    get_client_additional_information: (id: string) =>
      `/client/${id}/additionalInformation`,
    get_client_contacts: (id: string) =>
      `/client/${id}/getAll/additional-contacts`,
    add_client_contacts: (id: string) => `/client/${id}/additional-contacts`,
    update_profile_pic: (id: string) => `/client/photo/${id}`,
    update_profile: (id: string) => `/client/editClient/${id}`,
    update_settings: (id: string) => `/clientSettings/update/${id}`,
    update_additional_information: (id: string) =>
      `/client/${id}/additionalInformation`,
    update_client_contact: (id: string) => `/client/${id}/additional-contacts`,
    delete_client_contact: (id: string, contact_id: number) =>
      `/client/${id}/additional-contacts/${contact_id}`,
    // get_client_funds: (id: string) => `/funds/client/${id}`
    get_client_funds: "/funds/clients/allFunds",
    // get_billing_report: (clientId?: string) =>
    //   `/billingReport/client/${clientId}/dates`,
    get_billing_report: (clientId?: string) =>
      `/billingReport/get/client/${clientId}/dates`,
    get_billing_list: () => `/invoices/to-be-generated`,
    update_billing_report: (billingReportId: string) =>
      `/billingReport/update/${billingReportId}`,
    get_invoice_preview: "/invoices/preview",
    generate_invoice: "/invoices/generateNew",
    get_invoice_list: "/invoices/generated",
    get_invoice_view: (invoiceId?: string) => `/invoices/${invoiceId}`,
    get_list_void: "/invoices/getAll/voidInvoice",
    create_Invoice_Void: (invoiceId?: string) => `/invoices/${invoiceId}/void`,
    create_invoice_payment: (invoiceId: string) =>
      `/invoices/${invoiceId}/addPayments`,
    get_Payment_List: (invoiceId: string) =>
      `/invoices/${invoiceId}/getPayments`,
    delete_invoice_payment: (invoiceId: string, paymentId: string) =>
      `/invoices/${invoiceId}/deletePayments/${paymentId}`,
    get_time_line: (invoiceId?: string) => `/invoices/${invoiceId}/timeline`,
    create_invoice_notes: (invoiceId?: string) =>
      `/invoices/${invoiceId}/addNotes`,
    get_all_template_documents: `/clientDocument/clients/documents/by-category/new`,
    create_client_document_subcategory: (categoryId: string) =>
      `/clientDocument-subcategories/${categoryId}`,
    create_template_document: (subCategoryId: string) =>
      `/clientDocument-subcategories/upload/${subCategoryId}`,
    delete_client_document: "clientDocument/delete",
    get_client_category: "/client/document-categories/all",
    get_client_document_category: `/client/document-categories/all`,
    get_client_sub_category: "/clientDocument-subcategories/all",
    update_client_document: (subCategoryId: string, documentId: string) =>
      `/clientDocument-subcategories/update-documents/${subCategoryId}/${documentId}`,
    create_price_import: () => `/priceBook/import`
  },
  teams: {
    get_all: "/teams/allTeams",
    create_team: "/teams/create",
    get_team: "/teams",
    edit_team: "/teams",
    delete_team: "/teams"
  },
  user: {
    profile: "/user/profile",
    profile_photo: "/user/profile/photo",
    update: "/user/profile/update"
  },
  roles: {
    all: "/roles/all"
  },
  funds: {
    add_fund: (id: string) => `/funds/add/${id}`
  },
  shift: {
    repeat_shift: "/shift/repeat",
    // create_shift: "/shift/createMultiple/with-available-employee",
    create_shift: "/shift/createMultiple/Unique/with-available-employee",
    cancel_shift_in_bulk: "/shift/cancelMultipleShift",
    get_all_shift_id: "/shift/getAllActiveShiftIds",
    get_all_shifts: "/shift/getAllActiveShiftNew",
    get_shifts_for_client: (id: string) =>
      `/shift/getAllActiveShift/ForAClient/${id}`,
    get_shifts_for_staff: (id: string) =>
      `/shift/getAllActiveShift/ForAEmployee/${id}`,
    edit_shift: (id?: number) => `/shift/update/${id}`,
    cancel_shift: (id?: number) => `/shift/cancelShift/${id}`,
    rebook_shift: (shiftid?: number) => `/shift/rebookShift/${shiftid}`,
    apply_shift: (shiftId?: number) => `/shift/${shiftId}/apply-pickup`,
    applied_shift_approve: (applicationId: number) =>
      `/shift/applications/${applicationId}`,
    get_applied_shift_list: (shiftId: number) => `/shift/${shiftId}/applicants`,
    swap_shift: "/shift/bulk-swap",
    notes: {
      get_all_shift_notes: `/shiftNote/getAllShiftNotes`,
      get_all_shift_notes_with_shift: `/shiftNote/getAllNotesWithShift`,
      get_all_notes: (id?: string) => `/shiftNote/getAllForClient/${id}`,
      get_all_notes_with_shift: (clientId?: string) =>
        `/shiftNote/getAllForClientWithShift/${clientId}`,
      add_note: `/shiftNote/add`,
      add_shift_note: `/shiftNote/add/forShift`,
      // add_shift_note: (shiftId?: string) =>
      //   `/shiftNote/add/forShift/${shiftId}`,
      export: (id: number) => `/shiftNote/exportShiftNotesToPdf/email/${id}`,
      shiftNotesExport: (clientId: number) =>
        `/shiftNote/exportNotesWithShiftToPdf/email/${clientId}`,
      exportpdf: (id: number) => `/shiftNote/exportShiftNotes/ToPdf/${id}`
    }
  },
  settings: {
    pricebook: {
      get_pricebooks: "/priceBook/getAll/priceBook",
      get_pricebooks_: "/priceBook/all/priceBookNames",
      get_all_pricebooks: "/priceBook/listAll/priceBook",
      add_pricebook: "/priceBook/add",
      edit_pricebook: (id: number) => `/priceBook/${id}`,
      delte_pricebook: (id: number) => `/priceBook/softDelete/${id}`,
      copy_pricebook: (id: number) => `/priceBook/copy/${id}`,
      get_pricebooks_list_all: "/priceBook/listAll/priceBook",
      get_expired_price_filtered_data: "/priceBook/getAll/notExpiredPriceBook"
    },
    prices: {
      update_prices: (id: number) => `/prices/update/${id}`,
      price_import: "/priceBook/uploadFromDatabase"
    },
    pay_groups: {
      add_paygroup: "/payGroup/add",
      update_paygroup: (id: number) => `/payGroup/update/${id}`,
      delete_paygroup: (id: number) => `/payGroup/softDelete/${id}`,
      get_all_paygroup: "/payGroup/getAll/payGroup"
    },
    allowances: {
      get_all_allowances: "/allowances/all",
      add_allowance: "/allowances/add",
      update_allowance: (id: number) => `/allowances/${id}`,
      delete_allowance: (id: number) => `/allowances/${id}`
    },
    price_items: {
      update_price_items: (id: number) => `/payItems/update/${id}`
    }
  }
};

export const sucessNotificationEndPoints = [
  endpoints.auth.signup,
  endpoints.auth.login,
  endpoints.auth.set_password,
  endpoints.auth.forgot_password,
  endpoints.auth.reset_password,
  endpoints.auth.change_password,
  endpoints.user.profile_photo,
  endpoints.user.update,
  endpoints.staff.new,
  endpoints.staff.update_profile_photo,
  endpoints.staff.update_staff,
  endpoints.auth.resend_invite,
  endpoints.staff.upload_documents,
  endpoints.staff.delete_document,
  endpoints.staff.edit_document,
  // endpoints.staff.timesheet,
  endpoints.teams.create_team,
  endpoints.teams.delete_team,
  endpoints.teams.edit_team,
  endpoints.client.add_client,
  endpoints.settings.pricebook.add_pricebook
];
