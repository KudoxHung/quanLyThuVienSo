using System;
using BCrypt.Net;

public class HelloWorld
{
    public static void Main()
    {
        string password = "Admin@123";
        string hash = BCrypt.Net.BCrypt.HashPassword(password);
        Console.WriteLine(hash);
    }
}