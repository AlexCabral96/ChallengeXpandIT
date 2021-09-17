using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChallengeWebAPI.Models
{
    public class Contact
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        [Column("contact_name")]
        public string Name { get; set; }
        [Column("contact_address")]
        public string Address { get; set; }
        [Column("contact_email")]
        public string Email { get; set; }
        [Column("contact_photo_file_name")]
        public string PhotoFileName { get; set; }

        public List<Phone> Phones { get; set; }
        [NotMapped]
        public string PrivatePhone { get; set; }
    }
}
