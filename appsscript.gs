/**
 * Silverline Techno Solutions
 * Google Apps Script: Website Inquiry -> Google Sheet + Email Notification
 *
 * SETUP:
 * 1. Paste this entire script into Extensions > Apps Script on your target sheet.
 * 2. Replace ADMIN_EMAIL below with the notification inbox.
 * 3. Deploy > New deployment > Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *      - Copy the /exec URL and paste it into script.js (SHEET_API_URL).
 * 4. Run installTrigger() ONCE to enable email on manual row insertions.
 */

var ADMIN_EMAIL = 'silverlinetechnosolutions@gmail.com'; // change to your inbox

/**
 * Receives form POSTs from the website, appends a row to the sheet,
 * and emails the admin inbox with the inquiry details.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var d = e.parameter || {};

  var row = [
    d.type || '',
    d.name || '',
    d.email || '',
    d.phone || '',
    d.service || '',
    d.message || '',
    d.timestamp || ''
  ];
  sheet.appendRow(row);

  sendInquiryEmail(d);

  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sends a formatted email of the inquiry to the admin inbox.
 */
function sendInquiryEmail(d) {
  var subject = 'New Website Inquiry - ' + (d.type || 'Contact Inquiry');
  var body = [
    'A new inquiry was received on the Silverline website.',
    '-------------------------------------------',
    'Type:      ' + (d.type || 'Contact Inquiry'),
    'Name:      ' + (d.name || '-'),
    'Email:     ' + (d.email || '-'),
    'Phone:     ' + (d.phone || '-'),
    'Service:   ' + (d.service || '-'),
    'Message:   ' + (d.message || '-'),
    'Submitted: ' + (d.timestamp || '-'),
    '-------------------------------------------',
    'Please respond to the client at the earliest.'
  ].join('\n');

  try {
    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
  } catch (err) {
    Logger.log('Email send failed: ' + err);
  }
}

/**
 * Emails the latest row when a new row is inserted manually
 * (requires the installable onChange trigger installed via installTrigger()).
 */
function onChange(e) {
  if (!e || e.changeType !== 'INSERT_ROW') return;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var values = sheet.getRange(lastRow, 1, 1, 7).getValues()[0];
  var d = {
    type: values[0],
    name: values[1],
    email: values[2],
    phone: values[3],
    service: values[4],
    message: values[5],
    timestamp: values[6] || new Date().toLocaleString()
  };
  sendInquiryEmail(d);
}

/**
 * Run this once from the Apps Script editor (click Run) to install
 * the onChange trigger that emails you when rows are added manually.
 */
function installTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'onChange') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('onChange')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onChange()
    .create();
  Logger.log('onChange trigger installed.');
}
