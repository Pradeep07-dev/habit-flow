import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  return (
    <View style={styles.view}>
      <Text>Welcome to Login Page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
