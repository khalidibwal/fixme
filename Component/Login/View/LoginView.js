import React from "react";
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import InputLogin from "../InputLogin";
import Button from "../../../Component/Login/Button";
import Googlebtn from "../Googlebtn";

export default function LoginView(){
    return(
        <View style={Styles.bottomNavigationView}>
          <Text style={Styles.inputText}>Email Address</Text>
          <InputLogin placeholder="Eg. youremail@gmail.com" />
          <Text>Password</Text>
          <InputLogin placeholder="Password" />
          <TouchableOpacity>
            <Text style={Styles.forgetpass}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button text="Login" />
          <Googlebtn text="Login With Google" />
        </View>
    );
}

const Styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 20, // Adjust the radius as needed
        borderTopRightRadius: 20, // Adjust the radius as needed
        overflow: "hidden", // Clip the content to the rounded shape
      },
      forgetpass: {
        color: "#5BABE8",
      },
})