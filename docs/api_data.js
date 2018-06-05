define({ "api": [  {    "type": "post",    "url": "/email/contact",    "title": "Contact Ooloo",    "name": "ContactUs",    "group": "Email",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Your email.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Your name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "topic",            "description": "<p>Why are you contacting us.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Your message.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "sent",            "description": "<p>Bool of sent status.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"sent\": true\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "FailedToSend",            "description": "<p>There was an issue sending the email</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"someError\",\n  \"sent\": false\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/email.js",    "groupTitle": "Email"  },  {    "type": "post",    "url": "/email/signup",    "title": "Join mailing list",    "name": "JoinMailingList",    "group": "Email",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of user.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>First name of user.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "lastName",            "description": "<p>Last name of user.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "subscribed",            "description": "<p>Bool of whether subscribe was successful.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"subscribed\": true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/email.js",    "groupTitle": "Email"  },  {    "type": "post",    "url": "/email/passwordreset",    "title": "Reset password",    "name": "PasswordReset",    "group": "Email",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of account to reset password of.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "subscribed",            "description": "<p>Bool of whether email was sent successfully.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"sent\": true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/email.js",    "groupTitle": "Email"  },  {    "type": "post",    "url": "/interest",    "title": "Add an interest to a user's interests list",    "name": "AddInterest",    "group": "Interests",    "permission": [      {        "name": "authenticated user"      }    ],    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "interests",            "description": "<p>Array of interests to add.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "added",            "description": "<p>Boolean of successful addition</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/interest.js",    "groupTitle": "Interests"  },  {    "type": "delete",    "url": "/interest",    "title": "Remove an interest from a user's interests list",    "name": "DeleteInterest",    "group": "Interests",    "permission": [      {        "name": "authenticated user"      }    ],    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "interest",            "description": "<p>Interest to remove.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "deleted",            "description": "<p>Boolean of successful deletion</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"deleted\": true\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/interest.js",    "groupTitle": "Interests"  },  {    "type": "get",    "url": "/interest/list",    "title": "Get all avaiable interests",    "name": "GetAvailableInterests",    "group": "Interests",    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "interests",            "description": "<p>List of all available interests</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"subscriptions\": [\n     {\n       \"interests\": []\n     }\n  ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/interest.js",    "groupTitle": "Interests"  },  {    "type": "get",    "url": "/interest",    "title": "Get interests",    "name": "GetInterests",    "group": "Interests",    "permission": [      {        "name": "authenticated user"      }    ],    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "interests",            "description": "<p>List of all the user's interests</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"interests\": []\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/interest.js",    "groupTitle": "Interests"  },  {    "type": "get",    "url": "/user/username/:username",    "title": "Check if username is already taken",    "name": "CheckIfUsernameInUse",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>Username to check</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "taken",            "description": "<p>Boolean whether username is taken.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"taken\": true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "delete",    "url": "/user",    "title": "Delete user",    "name": "DeleteUser",    "group": "User",    "permission": [      {        "name": "authenticated user"      }    ],    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "deleted",            "description": "<p>Bool if deleted.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"deleted\": true\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "get",    "url": "/user",    "title": "Get current user object",    "name": "GetUser",    "group": "User",    "permission": [      {        "name": "authenticated user"      }    ],    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>Username of the User.</p>"          },          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "email_verified",            "description": "<p>Bool if email_verified of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>Role of the User.</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "interests",            "description": "<p>Selected interests of the User.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"name\": \"John Doe\",\n  \"email\": \"nick.mitrakos@gmail.com\",\n  \"username\": \"nmitrakos\",\n  \"email_verified\": false,\n  \"role\": \"Player\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "get",    "url": "/user",    "title": "Get user profile",    "name": "GetUserProfile",    "group": "User",    "permission": [      {        "name": "authenticated user"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>A user's username</p>"          }        ]      }    },    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>Username of the User.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"Name\": \"John Doe\",\n  \"Username\": \"jdoe\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "UserNotFound",            "description": "<p>The username of the User was not found.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",          "type": "json"        },        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user/login",    "title": "Login user",    "name": "Login",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of user.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>Password of user.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "jwt",            "description": "<p>JWT of user.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"Authorization\": \"someCrazyLongAuthorizationToken\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "AuthError",            "description": "<p>Incorrect email or password.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "UserNotFound",            "description": "<p>User wasn't found in the database.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"IncorrectCredentials\"\n}",          "type": "json"        },        {          "title": "Error-Response:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UseNotFound\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "delete",    "url": "/user/logout",    "title": "Logout user",    "name": "Logout",    "group": "User",    "permission": [      {        "name": "authenticated user"      }    ],    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "loggedOut",            "description": "<p>Boolean if logged out successfully.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"loggedOut\": true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user/passwordreset",    "title": "Reset password for user",    "name": "ResetPasswordFinal",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>Token pulled from URL</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>Password to use</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "passwordUpdated",            "description": "<p>Boolean if password updated successfully.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"passwordUpdated\": true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user",    "title": "Signup new user",    "name": "SignupUser",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of user.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>Password of user. Must be 7 characters in length or greater.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>Username of user.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "jwt",            "description": "<p>JWT for the user.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"Authorization\": \"someCrazyLongAuthorizationToken\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "PasswordTooShort",            "description": "<p>The password provided does not meet length requirements of &gt; 6 characters</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "emailTaken",            "description": "<p>The email provided is already in use</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "UsernameTaken",            "description": "<p>The username provided is already taken</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "EmailTaken",            "description": "<p>That email is already in use.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 400 Invalid request\n{\n  \"error\": \"PasswordTooShort\"\n}",          "type": "json"        },        {          "title": "Error-Response:",          "content": "HTTP/1.1 400 Invalid request\n{\n  \"error\": \"EmailTaken\"\n}",          "type": "json"        },        {          "title": "Error-Response:",          "content": "HTTP/1.1 400 Invalid request\n{\n  \"error\": \"UsernameTaken\"\n}",          "type": "json"        },        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"EmailTaken\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "put",    "url": "/user",    "title": "Update current user",    "name": "UpdateUser",    "group": "User",    "permission": [      {        "name": "authenticated user"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the User.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of the User.</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "interests",            "description": "<p>Selected interests of the User.</p>"          }        ]      }    },    "header": {      "fields": {        "Authorization": [          {            "group": "Authorization",            "type": "String",            "optional": false,            "field": "authorization",            "description": "<p>Authorization token (normally a JWT included &quot;Bearer&quot; at the beginning, but please exclude that text before the token).</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>Username of the User.</p>"          },          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "email_verified",            "description": "<p>Bool if email_verified of the User.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>Role of the User.</p>"          },          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "interests",            "description": "<p>Selected interests of the User.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"name\": \"John Doe\",\n  \"email\": \"nick.mitrakos@gmail.com\",\n  \"username\": \"nmitrakos\",\n  \"email_verified\": false,\n  \"role\": \"User\",\n  \"interests\": []\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Not an authorized or authenticated user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Not Found\n{\n  \"error\": \"Unauthorized\",\n  \"message\": \"Error response\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user/verifyemail",    "title": "Verify email address",    "name": "VerifyEmail",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>Token pulled from URL</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Bool",            "optional": false,            "field": "emailVerified",            "description": "<p>Boolean if verified successfully.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"emailVerified\": true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routers/user.js",    "groupTitle": "User"  }] });
