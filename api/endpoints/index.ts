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
    new: "/user/add",
    list: "/user/employees/by-company/active",
    getStaff: "/user",
    update_profile_photo: "/user/photo",
    get_staff_settings: "/employeeSettings/employees",
    staff_compliance: (id: string) =>
      `/document/employees/${id}/documents/by-category/3`,
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
    delete_document: "/document"
  },
  client: {
    get_all: "/client/getAll/by-company",
    add_client: "/client/add"
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
  endpoints.teams.create_team,
  endpoints.teams.delete_team,
  endpoints.teams.edit_team,
  endpoints.client.add_client
];
