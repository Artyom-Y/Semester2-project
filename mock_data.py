import random
import sqlite3

paris_postal_codes = [i for i in range(70001, 70020 + 1)]

seine_saint_denis_codes = [
    93000, 93100, 93110, 93120, 93140, 93150, 93160, 93170, 93190,
    93220, 93230, 93240, 93250, 93260, 93270, 93290, 93300, 93310,
    93320, 93330, 93340, 93350, 93360, 93370, 93390, 93400, 93410,
    93420, 93430, 93440, 93450, 93460, 93470, 93500, 93600, 93700,
    93800, 93200
]
val_de_marne_codes = [
    94000, 94480, 94140, 94110, 94470, 94380, 94360, 94230, 94500,
    94220, 94430, 94550, 94600, 94120, 94260, 94250, 94240, 94200,
    94340, 94270, 94450, 94700, 94520, 94440, 94130, 94880, 94310,
    94490, 94170, 94420, 94510, 94150, 94160, 94100, 94410, 94370,
    94320, 94460, 94800, 94290, 94190, 94350, 94300, 94400
]

hauts_de_seine_codes = [
    92000, 92160, 92600, 92220, 92270, 92100, 92340, 92290, 92320,
    92370, 92140, 92110, 92700, 92400, 92260, 92380, 92250, 92230,
    92130, 92300, 92240, 92430, 92190, 92120, 92200, 92350, 92800,
    92500, 92210, 92330, 92310, 92150, 92170, 92420, 92410, 92390
]

suburb_codes = seine_saint_denis_codes + val_de_marne_codes + hauts_de_seine_codes


def random_customer(in_paris_chance = 0.66): # according to our client, 66% customers are in Paris
    """Helper function for generating a random customer. 
    We don't have access to any real data, so we use mock one."""
    in_paris = False
    if random.random() < in_paris_chance:
        in_paris = True

    if not in_paris:
        customer_code = random.choice(suburb_codes)
    else:
        customer_code = random.choice(paris_postal_codes)

    types = ["pharmacy", "clinic", "supplier"]
    
    customer_type = random.choices(types, [0.7, 0.1, 0.2])

    return [customer_code, *customer_type]


def random_customers(amount):
    """Call random_customer 'amount' times and insert it into customers table (replace current table)"""
    customers = []
    customers.append((0, random.choice(suburb_codes), "hospital"))

    for i in range(1, amount):
        customer = tuple([i] + random_customer())
        customers.append(customer)

    con = sqlite3.connect("database.sqlite")
    cur = con.cursor()
    cur.execute("DELETE FROM customers")
    cur.executemany("INSERT INTO customers VALUES (?, ?, ?)", customers)
    con.commit()


def random_orders():
    """Generate orders based on current customers list. This function is meant for testing purposes and it contains a lot of magic numbers"""
    con = sqlite3.connect("database.sqlite")
    cur = con.cursor()
    cur.execute("SELECT * FROM customers")
    res = cur.fetchall()
    orders = []
    count = 0

    for customer_idx, _, customer_type in res:
        order_amount = random.choices([1,2,3], [0.6, 0.3, 0.1])[0]
        for _ in range(order_amount):
            temp_sensitive = random.choices([0,1], [0.9, 0.1])[0]
            deadline = ""

            match customer_type:
                case "hospital":
                    deadline = random.choices([random.randrange(7, 9), random.randrange(10, 12)], [0.7, 0.3])[0]
                case "clinic":
                    if random.random() < 0.7:
                        deadline = random.choices([random.randrange(9, 13), random.randrange(14, 19)], [0.4, 0.6])[0]
                case "pharmacy":
                    if random.random() < 0.3:
                        deadline = random.choices([random.randrange(12, 15), random.randrange(16, 20)], [0.4, 0.6])[0]

            if deadline:
                deadline = str(deadline) + ":00"

            orders.append((count, customer_idx, temp_sensitive, deadline))
            count += 1

    cur.execute("DELETE FROM orders")
    cur.executemany("INSERT INTO orders VALUES (?, ?, ?, ?)", orders)
    con.commit()
    

if __name__ == "__main__":
    random_orders()