export class UpdatePasswordDto {
  userId: string;
  newPassword: string;
  recoveryCode: number;
}
