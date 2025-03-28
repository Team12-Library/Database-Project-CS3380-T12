﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public partial class Waitlist
{
    [Key]
    [ForeignKey("CustomerId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int WaitlistId { get; set; }
    
    public int CustomerId { get; set; }

    public int ItemId { get; set; }

    public DateTime ReservationDate { get; set; }

    public bool isReceived { get; set; }

}
