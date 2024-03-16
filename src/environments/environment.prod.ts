export const environment = {
    production: true,
    // Keycloak url
    //keykloakBaseUrl: 'http://192.168.1.39:8080/auth',
    //serviceBaseUrl:  'http://192.168.1.39:8080/database',
    keykloakBaseUrl: 'http://localhost:8080/auth',
    serviceBaseUrl:  'http://localhost:8080/database',
    // Rest url config
    API_URL: "/api/",
    API_URL4FILE: "/uploadfile/",
    //fire base config
    firebase: {
        apiKey: "AIzaSyBJFAKMyDO_lmqBYUwW6CWjBIMTHyFGZKc",
        authDomain: "sportpat-5e155.firebaseapp.com",
        databaseURL: "https://sportpat-5e155.firebaseio.com",
        projectId: "sportpat-5e155",
        storageBucket: "sportpat-5e155.appspot.com",
        messagingSenderId: "193416492629"
    },
    // Langages for the translator
    langs: ["en", "fr", "es"]
};
