using Microsoft.EntityFrameworkCore;
using DarkLoboComics.Api.Models;

namespace DarkLoboComics.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<ComicSeries> ComicSeries { get; set; }
    public DbSet<ComicPage> ComicPages { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Username).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
            
            entity.HasOne(u => u.Subscription)
                .WithOne(s => s.User)
                .HasForeignKey<Subscription>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ComicSeries configuration
        modelBuilder.Entity<ComicSeries>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired();
            
            entity.HasMany(s => s.Pages)
                .WithOne(p => p.Series)
                .HasForeignKey(p => p.SeriesId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ComicPage configuration
        modelBuilder.Entity<ComicPage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.SeriesId, e.PageNumber }).IsUnique();
            entity.Property(e => e.ImageUrl).IsRequired();
        });

        // Subscription configuration
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }
}
