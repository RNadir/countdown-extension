const config = {
    storage_name: "countdowns",
    card: {
        wrapper: "cards_wrapper",
        title: "card_title",
        number: "card_number",
        description: "card_description",
        buttons: {
            remove: "card_buttons_remove",
            copy: "card_buttons_copy",
            bookmark: "card_buttons_bookmark"
        }
    },
    buttons: {
        add_new: "create_card_button",
        confirm_add_modal: "confirm_add_modal",
        filter: "filter_counters_button",
        card_remove: "card_buttons_remove",
        card_copy: "card_buttons_copy",
        card_bookmark: "card_buttons_bookmark"
    },
    modals: {
        add_new: "add_card_modal",
        add_datepicker: "add_datepicker"
    }
}

const renderCard = (title, number, description, index) => {

    let today = new Date().getTime()
    let card_date = new Date(number).getTime();

    let days_left = card_date - today;

    days_left = days_left / (1000 * 3600 * 24);

    // Add in version 2 myb
    //<div class="card_buttons_button card_buttons_bookmark" data-index="${index}"><img src="./images/bookmark.svg"alt="Bookmark icon"></div>

    let card_string = `
    <div class="card" data-card-index="${index}">
    <div class="card_buttons">
        
        <div class="card_buttons_button card_buttons_copy" data-index=${index}><img src="./images/copy.svg" alt="Copy icon"></div>
        <div class="card_buttons_button card_buttons_remove" data-index=${index}><img src="./images/remove.svg"alt="Remove icon"></div>
    </div>
    <div class="card_title">${title}</div>
    <div class="card_number">${Math.ceil(days_left)}</div>
    <div class="card_description">${description}</div>
    </div>`;
    
    // Append
    document.getElementById(config.card.wrapper).innerHTML += card_string;

    // 'Remove card' event listener
    $(`.${config.buttons.card_remove}`).on('click', (e) => { removeCard($(e.delegateTarget).data('index'))});

    // 'Copy card' event listener
    $(`.${config.buttons.card_copy}`).on('click', (e) => { copyCard($(e.delegateTarget).data('index'))});
}

const addNewCard = (serialized_data) => {

    // Parse searialized data into JS object
    let card_object = JSON.parse('{"' + decodeURI(serialized_data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replaceAll('+', ' ') + '"}');

    // URL decode i trim
    card_object.card_title = decodeURIComponent(card_object.card_title.trim());
    card_object.card_date = decodeURIComponent(card_object.card_date.trim());
    card_object.card_desc = decodeURIComponent(card_object.card_desc.trim());

    // Validations
    if (!card_object.card_title) { toastr.error("Card title was not sent!") }
    if (!card_object.card_date) { toastr.error("Card date was not sent!") }
    if (!card_object.card_desc) { toastr.error("Card description was not sent!") }

    // Get storage
    let current_storage = JSON.parse(localStorage.getItem(config.storage_name)) ?? [];

    // Add card
    current_storage.push(card_object);

    let card_index = current_storage.length - 1;

    // Save
    localStorage.setItem(config.storage_name, JSON.stringify(current_storage));

    // Notification
    toastr.success("Card successfully added!");

    // Add that card
    renderCard(card_object.card_title, card_object.card_date, card_object.card_desc, card_index);

    // Hide modal
    $(`#${config.modals.add_new}`).modal('hide');
}

const removeCard = (index) => {

    // Get storage
    let storage = JSON.parse(localStorage.getItem(config.storage_name));

    // Remove item
    storage.splice(index, 1);

    // Remove element from DOM
    // $(document.querySelector(`[data-card-index="${index}"]`)).remove();
    
    // Render all cards
    document.getElementById(config.card.wrapper).innerHTML = '';
    storage.forEach((element, index) => { renderCard(element.card_title, element.card_date, element.card_desc, index); });


    // Spasavanje u storage
    localStorage.setItem(config.storage_name, JSON.stringify(storage));
}

const copyCard = (index) => {

    // Get storage
    let storage = JSON.parse(localStorage.getItem(config.storage_name));

    // Kopiranje kartice
    storage.push(storage[index]);

    // Dodavanje kartice u DOM
    renderCard(storage[index].card_title, storage[index].card_date, storage[index].card_desc, storage.length - 1);

    localStorage.setItem(config.storage_name, JSON.stringify(storage));
}

$(document).ready(function () {

    // Get storage
    let storage = JSON.parse(localStorage.getItem(config.storage_name)) ?? [];

    // Kreiranje datepickera
    new Datepicker($(`#${config.modals.add_datepicker}`)[0], { autohide: true });

    // 'Add modal' event listere
    $(`#${config.buttons.add_new}`).on('click', () => { $(`#${config.modals.add_new}`).modal({ show: true }); });

    // Confirm 'add modal' event listener
    $(`#${config.buttons.confirm_add_modal}`).on('click', (e) => { addNewCard($(e.target).parent().siblings('.modal-body').children('form').serialize()) });

    // Reset 'add modal' on close
    $(`#${config.modals.add_new}`).on('hide.bs.modal', () => { $(this).find('form').trigger('reset'); })

    // Render all cards
    storage.forEach((element, index) => { renderCard(element.card_title, element.card_date, element.card_desc, index); });
});