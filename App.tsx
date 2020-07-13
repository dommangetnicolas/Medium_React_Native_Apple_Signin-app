import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import React from "react";
import { StyleSheet, View, StatusBar, Alert } from "react-native";
import Axios from "axios";

export default function App() {
  /**
   * CallBack function for the button.
   */
  const onAppleButtonPress = async () => {
    // Make a request to apple.
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    // Get the credential for the user.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    // If the Auth is authorized, we call our API and pass the authorization code.
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      console.log(appleAuthRequestResponse.authorizationCode);

      Axios.post("http://172.20.10.9:3000/auth/apple", {
        token: appleAuthRequestResponse.authorizationCode,
      }).then((res) => {
        if (res?.data?.user) {
          Alert.alert(`Number of connections: ${res.data.user.nbOfConnections.toString()}`);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Apple Sign-in button */}
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: 160,
          height: 45,
        }}
        onPress={() => onAppleButtonPress()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
