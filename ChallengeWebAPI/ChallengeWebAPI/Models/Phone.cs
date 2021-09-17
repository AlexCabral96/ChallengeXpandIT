using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChallengeWebAPI.Models
{
    public class Phone
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Column("contact_id")]
        public int ContactId { get; set; }
        [Column("number")]
        public string Number { get; set; }
        [Column("phone_description")]
        public string Description { get; set; }
        //public Contact Contact { get; set; }
        //[ForeignKey("contact_id")]
        //public List<Contact> Contacts { get; set; }
    }
}
