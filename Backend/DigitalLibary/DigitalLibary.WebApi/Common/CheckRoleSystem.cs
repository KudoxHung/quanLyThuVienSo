using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.WebApi.Helper;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace DigitalLibary.WebApi.Common
{
    public class CheckRoleSystem
    {
        #region Variables

        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;

        #endregion

        #region Contructor

        public CheckRoleSystem(JwtService jwtService, IUserRepository userRepository)
        {
            _jwtService = jwtService;
            _userRepository = userRepository;
        }

        #endregion

        #region FUNCTION

        public CheckAdminModel CheckAdmin(string headerValue)
        {
            try
            {
                // init check admin model
                var checkAdminModel = new CheckAdminModel();
                var jwt = headerValue.ToString().Split(' ');
                // check jwt exits
                if (jwt[1].Length == 0)
                {
                    checkAdminModel.check = false;
                    return checkAdminModel;
                }

                // verify json web token
                var token = _jwtService.Verify(jwt[1]);

                // check security of jwt
                var handler = new JwtSecurityTokenHandler();
                var tokenS = handler.ReadToken(jwt[1].ToString()) as JwtSecurityToken;
                var profile = tokenS.Claims.First(claim => claim.Type == "email").Value;
                //get user from database by email
                var user = _userRepository.getUserByEmail(profile);
                // get list role of user
                var userRole = _userRepository.getListRoleOfUser(user.Id);
                // init variable check in list role of user
                var checkListRole = userRole.Select(t => _userRepository.getUserRolebyId(new Guid(t.IdRole)))
                    .Where(role => role != null).Any(role => role.RoleName == "Admin");
                if (checkListRole)
                {
                    checkAdminModel.check = true;
                    checkAdminModel.Id = user.Id;
                }
                else
                {
                    checkAdminModel.check = false;
                }

                return checkAdminModel;
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public bool CheckUserInSystem(string headerValue)
        {
            var jwt = headerValue.ToString().Split(' ');
            // check jwt exits
            if (jwt[1].Length == 0)
            {
                return false;
            }

            // verify json web token
            var token = _jwtService.Verify(jwt[1]);

            // check security of jwt
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(jwt[1].ToString()) as JwtSecurityToken;
            var profile = tokenS.Claims.First(claim => claim.Type == "email").Value;
            //get user from database by email
            var user = _userRepository.getUserByEmail(profile);

            if (user != null) return true;

            return false;
        }

        #endregion
    }
}