
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/auth/registration": {
        "post": {
          "operationId": "registration",
          "summary": "A new user is registered in the system",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address"
            },
            "400": {
              "description": "If the inputModel has incorrect values (in particular if the user with the given email or password already exists)"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "login",
          "summary": "New user login after registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)"
            },
            "401": {
              "description": "If the password or login is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "registrationEmailResending",
          "summary": "Re-sends registration confirmation code",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResendingEmailConfirmationDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere"
            },
            "400": {
              "description": "If the inputModel has incorrect values"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "registrationConfirmation",
          "summary": "Confirmation of registration via confirmation code",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationConfirmationDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "If the confirmation code is incorrect, expired or already been applied"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "passwordRecovery",
          "summary": "Password recovery request",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PasswordRecoveryDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "createNewPassword",
          "summary": "Sending a new password",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If code is valid and new password is accepted"
            },
            "400": {
              "description": "If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "updatePairToken",
          "summary": "Update authorization tokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)."
            },
            "401": {
              "description": "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)."
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "logout",
          "summary": "User logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Inctagram-api",
      "description": "The Users API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "RegistrationDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "somemail@mail.com",
              "description": "User`s email"
            },
            "login": {
              "type": "string",
              "example": "UserLogin",
              "description": "User`s login",
              "minLength": 6,
              "maxLength": 30
            },
            "password": {
              "type": "string",
              "example": "qwerty123",
              "description": "User`s password",
              "minLength": 6,
              "maxLength": 20
            },
            "passwordConfirmation": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "login",
            "password",
            "passwordConfirmation"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string"
            },
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "ResendingEmailConfirmationDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "E-mail to which the confirmation code will be sent"
            }
          },
          "required": [
            "email"
          ]
        },
        "RegistrationConfirmationDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Registration confirmation code"
            }
          },
          "required": [
            "code"
          ]
        },
        "PasswordRecoveryDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "Mail registered account, which will be a password recovery code"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "New password",
              "minLength": 6,
              "maxLength": 20
            },
            "recoveryCode": {
              "type": "string",
              "description": "Password recovery code"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        }
      }
    }
  },
  "customOptions": {
    "urls": [
      {
        "url": "http://localhost:5002/swagger-json",
        "name": "Users API"
      }
    ]
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
