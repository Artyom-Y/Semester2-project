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

def random_customer(hospital, in_paris_chance = 0.66): # according to our client, 66% customers are in Paris
    """Helper function for generating a random customer. 
    We don't have access to any real data, so we use mock one."""
    in_paris = False
    if random.random() < in_paris_chance:
        in_paris = True

    if not in_paris:
        customer_code = random.choice(seine_saint_denis_codes + val_de_marne_codes + hauts_de_seine_codes)
    else:
        customer_code = random.choice(paris_postal_codes)

    types = ["pharmacy", "clinic", "supplier"]
    if hospital:
        types = ["hospital"] # we must include 1 hospital
    
    customer_type = random.choice(types)

    return [customer_code, customer_type]

def random_customers(amount):
    customers = []
    hospital = True

    for i in range(amount):
        customer = tuple([i] + random_customer(hospital))
        customers.append(customer)
        if customer[2] == "hospital":
            hospital = False

    con = sqlite3.connect("database.sqlite")
    cur = con.cursor()
    cur.executemany("INSERT INTO customers VALUES (?, ?, ?)", customers)
    con.commit()

random_customers(35)