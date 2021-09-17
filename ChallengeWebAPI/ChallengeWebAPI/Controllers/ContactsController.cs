using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChallengeWebAPI.Models;
using System;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ChallengeWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactContext _context;
        private readonly IWebHostEnvironment _env;

        public ContactsController(ContactContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Contacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            var contacts = await _context.Contacts.Select(contact => new Contact
            {
                Id = contact.Id,
                Name = contact.Name,
                Email = contact.Email,
                PhotoFileName = contact.PhotoFileName,
                PrivatePhone = _context.Phones.Where(phone => phone.ContactId == contact.Id && phone.Description.Equals("Telemóvel"))
                    .Select(phone => phone.Number).FirstOrDefault()
            }).OrderBy(contact => contact.Id).ToListAsync();

            return contacts;
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.Select(contact => new Contact
            {
                Id = contact.Id,
                Name = contact.Name,
                Address = contact.Address,
                Email = contact.Email,
                PhotoFileName = contact.PhotoFileName,
                PrivatePhone = _context.Phones.Where(phone => phone.ContactId == contact.Id && phone.Description.Equals("Telemóvel"))
                    .Select(phone => phone.Number).FirstOrDefault(),
                Phones = _context.Phones.Where(phone => phone.ContactId == contact.Id).ToList()
            }).Where(contact => contact.Id == id)
              .OrderBy(contact => contact.Id)
              .FirstAsync();

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // PUT: api/Contacts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            Phone phoneUpdate;
            foreach (Phone phoneJSON in contact.Phones.ToList())
            {
                if (_context.Phones.Any(r => r.Id == phoneJSON.Id))
                {
                    phoneUpdate = _context.Phones.Where(r => r.Id == phoneJSON.Id).First();
                    phoneUpdate.Number = phoneJSON.Number;
                }
                else
                {
                    phoneUpdate = new Phone();
                    phoneUpdate.ContactId = phoneJSON.ContactId;
                    phoneUpdate.Description = phoneJSON.Description;
                    phoneUpdate.Number = phoneJSON.Number;

                    _context.Phones.Add(phoneUpdate);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/Contacts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            _context.Contacts.Add(contact);

            Phone phoneAdd;
            foreach (Phone phoneJSON in contact.Phones.ToList())
            {
                phoneAdd = new Phone();
                phoneAdd.ContactId = phoneJSON.ContactId;
                phoneAdd.Description = phoneJSON.Description;
                phoneAdd.Number = phoneJSON.Number;

                _context.Phones.Add(phoneAdd);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContact", new { id = contact.Id }, contact);
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Photos/" + fileName;

                if (string.IsNullOrEmpty(fileName))
                    return new JsonResult("");

                using (FileStream stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(fileName);
            }
            catch (Exception)
            {
                throw;
            }
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}
