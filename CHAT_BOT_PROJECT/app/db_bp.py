from flask import Blueprint, request, jsonify
from app import db
import random
from app.models import GeneralFirstInput, OurBotInput
from sqlalchemy import distinct, and_

db_bp = Blueprint("db_bp", __name__, template_folder="templates")

def general_qs_random(tenant_id, office_id):
    # Query to retrieve all values from the specified column
    all_rows = db.session.query(distinct(GeneralFirstInput.user_input)) \
        .filter(GeneralFirstInput.tenantid == tenant_id) \
        .filter(GeneralFirstInput.officeid == office_id) \
        .filter(and_(GeneralFirstInput.user_input.isnot(None), GeneralFirstInput.user_input != '')) \
        .all()

    # Ensure there are enough rows to select from
    if len(all_rows) < 4:
        values_default = ['Top shipping companies in India?', 'What are the main shipping routes serviced by Indian shipping liners?', "How do Indian shipping liners contribute to their countries maritime industry?", "What technological advancements have Indian shipping liners adopted to enhance efficiency and sustainability?"]
        return values_default

    # Randomly select four unique rows
    selected_rows = random.sample(all_rows, 4)

    # Extract values from the selected rows
    selected_values = [row[0] for row in selected_rows]
    
    return selected_values

@db_bp.route('/randomQs', methods=['POST'])
def get_random_rows():
    tenant_id = request.json.get('tenantid')
    office_id = request.json.get('officeid')
    module = request.json.get('module')
    print(module)
    # Query to retrieve all values from the specified column
    all_rows = db.session.query(distinct(OurBotInput.user_input)) \
    .filter(OurBotInput.tenantid == tenant_id) \
    .filter(OurBotInput.officeid == office_id) \
    .filter(and_(OurBotInput.user_input.isnot(None), OurBotInput.user_input != '', OurBotInput.module == module)) \
    .all()

    # Ensure there are enough rows to select from
    if len(all_rows) < 4:
        if module.lower() == 'lead':
            values_default = ['how many hot, management leads from india', 'how many hot, management leads in last 3 months', 'how many hot leads', 'how many leads with name s in last 3 years']
        elif module.lower() == 'enquiry':
            values_default = ['how many hot enquiries from chennai to china', 'how many quotation sent for the enquiries in last 20 days', 'how many enquiries with shipment type imp_sea_fcl', 'how many quote created enquiries in last 4 months']
        elif module.lower() == 'quotation':
            values_default = ['how many quotations on 2022 may 7 to 16', 'How many quotation from chennai to china with shipment term fob in last 2 days','how many FOB quotations on yesterday', 'how many booking created quotations in last month']
        return jsonify(values_default)

    # Randomly select four unique rows
    selected_rows = random.sample(all_rows, 4)

    # Extract values from the selected rows
    selected_values = [row[0] for row in selected_rows]
    print(selected_values)

    return jsonify(selected_values)