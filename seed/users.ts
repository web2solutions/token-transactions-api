const users: Array<any> = [{
        "username": "employee1",
        "password": "employee1_password",
        "permissions": ["create_account", "view_account", "update_account", "delete_account", "create_transaction", "delete_transaction", "view_transaction"]
    },
    {
        "username": "employee2",
        "password": "employee2_password",
        "permissions": ["create_transaction", "view_account", "view_transaction"]
    },
    {
        "username": "employee3",
        "password": "employee3_password",
        "permissions": ["create_transaction", "view_account", "view_transaction"]
    },
    {
        "username": "employee4",
        "password": "employee4_password",
        "permissions": ["create_transaction"]
    },
]
export default users;