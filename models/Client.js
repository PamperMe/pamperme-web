function Client(client) {
    this.name = client.name;
    this.uid = client.UID;
    this.address = client.address;
    this.email = client.email;
    this.phone = client.phone;
    this.description = client.description;
}

module.exports = Client;

