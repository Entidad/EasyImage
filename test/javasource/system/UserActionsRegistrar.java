package system;

import com.mendix.core.actionmanagement.IActionRegistrator;

public class UserActionsRegistrar
{
  public void registerActions(IActionRegistrator registrator)
  {
    registrator.bundleComponentLoaded();
    registrator.registerUserAction(encryption.actions.DecryptString.class);
    registrator.registerUserAction(encryption.actions.EncryptString.class);
    registrator.registerUserAction(encryption.actions.GeneratePGPKeyRing.class);
    registrator.registerUserAction(encryption.actions.PGPDecryptDocument.class);
    registrator.registerUserAction(encryption.actions.PGPEncryptDocument.class);
    registrator.registerUserAction(encryption.actions.ValidatePrivateKeyRing.class);
    registrator.registerUserAction(main.actions.ja_get_admin_user_name.class);
    registrator.registerUserAction(main.actions.ja_get_admin_user_rolename.class);
    registrator.registerUserAction(main.actions.ja_guid.class);
    registrator.registerUserAction(system.actions.VerifyPassword.class);
  }
}
