import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../Features/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  if (component.editForm?.dirty) {
    return confirm('are you sure you want to continue and all unsaved changes will be lost');
  }

  return true;
};
